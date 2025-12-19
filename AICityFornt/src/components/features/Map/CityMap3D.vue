<script setup>
import { onMounted, ref } from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const container = ref(null);

// 城市配置 - 可切换不同城市展示
const CITIES = {
  xinyang: { lon: 114.0913, lat: 32.1477, height: 2000, name: "信阳" },
  shanghai: { lon: 121.4737, lat: 31.2304, height: 1500, name: "上海" },
  beijing: { lon: 116.4074, lat: 39.9042, height: 2000, name: "北京" },
  shenzhen: { lon: 114.0579, lat: 22.5431, height: 1500, name: "深圳" },
  newyork: { lon: -74.006, lat: 40.7128, height: 1500, name: "纽约" },
};

// 选择演示城市 (大城市有更多3D建筑)
const currentCity = ref(CITIES.shanghai);
let viewerInstance = null;

// 切换城市函数
const changeCity = (cityKey) => {
  const city = CITIES[cityKey];
  currentCity.value = city;

  if (viewerInstance) {
    viewerInstance.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        city.lon,
        city.lat,
        city.height
      ),
      orientation: {
        heading: Cesium.Math.toRadians(45),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0,
      },
      duration: 2, // 飞行时间 2秒
    });
  }
};

onMounted(async () => {
  // Set Cesium Ion Token
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NTJjNDhlZC02YmFhLTRmNDItODMxNi0zZmVkNGFkYzY5OTIiLCJpZCI6MzY0Mjk2LCJpYXQiOjE3NjQyMDUzMTN9._zhBjmcR6PlaGoB7lp-dDSAO5bBHz3A82r4WDCu7z7s";

  // 高德地图底图配置 (无需申请Key)
  const AMAP_LAYERS = {
    // 卫星影像 - 使用更稳定的 URL 格式
    satellite: 'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    // 矢量地图
    vector: 'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    // 卫星影像标注
    annotation: 'https://webst{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
  }

  // 1. Create Viewer
  const viewer = new Cesium.Viewer(container.value, {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    contextOptions: {
        webgl: { alpha: true }
    },
    // 使用高德卫星影像作为底图
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      url: AMAP_LAYERS.satellite,
      subdomains: ['01', '02', '03', '04'], // 修正子域名格式
      maximumLevel: 18
    })
  });

  // 添加备用底图：如果高德加载失败，尝试叠加 ArcGIS 影像 (全球覆盖，无需Key)
  // 注意：Cesium 默认只能有一个 BaseLayer，这里作为叠加层添加，以防万一
  try {
    const arcgisProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    );
    // 如果发现高德加载可能有问题（虽然很难直接检测），可以手动切换
    // 这里我们仅记录，或者在 UI 上提供切换选项
    console.log('[Map] Base layers configured');
  } catch (e) {
    console.warn('[Map] ArcGIS backup layer failed:', e);
  }

  viewerInstance = viewer;

  // 叠加高德路网标注图层 (可选)
  // viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  //   url: AMAP_LAYERS.annotation,
  //   subdomains: ['1', '2', '3', '4'],
  //   maximumLevel: 18
  // }));

  // 2. Hide credits
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // 3. Customize Appearance
  viewer.scene.skyBox.show = false;
  viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#0F172A");
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#1e293b");
  viewer.scene.globe.enableLighting = false;

  // 提高渲染质量
  viewer.scene.globe.maximumScreenSpaceError = 1; // 更高精度地形
  viewer.resolutionScale = window.devicePixelRatio; // 高分辨率

  // 4. Load Terrain
  try {
    viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
      1
    );
  } catch (e) {
    console.warn("Terrain loading failed:", e);
  }

  // 5. 加载 3D 建筑 - 优先 Google 3D Tiles，无覆盖区域使用 OSM Buildings
  let hasGoogle3DTiles = false;

  // 5.1 尝试加载 Google Photorealistic 3D Tiles (大城市有覆盖)
  try {
    const googleTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(googleTileset);
    hasGoogle3DTiles = true;
    console.log("[3D] Google Photorealistic 3D Tiles 加载成功");
  } catch (e) {
    console.warn("[3D] Google 3D Tiles 不可用:", e.message);
  }

  // 5.2 加载 OSM Buildings 作为补充/回退
  try {
    const osmBuildings = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
    viewer.scene.primitives.add(osmBuildings);

    // 赛博朋克风格
    osmBuildings.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ['${feature["building"]} === "commercial"', 'color("#A855F7", 0.85)'], // 紫色-商业
          ['${feature["building"]} === "apartments"', 'color("#06B6D4", 0.85)'], // 青色-住宅
          ['${feature["building"]} === "office"', 'color("#3B82F6", 0.85)'], // 蓝色-办公
          ['${feature["building"]} === "industrial"', 'color("#F59E0B", 0.85)'], // 橙色-工业
          ["true", 'color("#06B6D4", 0.7)'], // 默认青色
        ],
      },
    });

    if (hasGoogle3DTiles) {
      console.log("[3D] OSM Buildings 加载成功 (作为补充图层)");
    } else {
      console.log("[3D] OSM Buildings 加载成功 (主要图层)");
    }
  } catch (e) {
    console.warn("[3D] OSM Buildings 加载失败:", e.message);
  }

  // 5.3 加载本地离线 GeoJSON 建筑数据 (信阳)
  try {
    const dataSource = await Cesium.GeoJsonDataSource.load('/data/xinyang-buildings.geojson');
    const entities = dataSource.entities.values;
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const props = entity.properties;
      // 获取高度属性，默认 10米
      const height = props.height ? props.height.getValue() : 10;
      
      entity.polygon.extrudedHeight = height;
      entity.polygon.material = Cesium.Color.fromCssColorString('#06B6D4').withAlpha(0.8);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.CYAN.withAlpha(0.3);
    }
    
    viewer.dataSources.add(dataSource);
    console.log('[3D] 本地信阳建筑 GeoJSON 加载成功');
  } catch (e) {
    console.warn('[3D] 本地建筑数据加载失败:', e);
  }

  // 6. Set Camera - 使用较低高度查看更多细节
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      currentCity.value.lon,
      currentCity.value.lat,
      currentCity.value.height
    ),
    orientation: {
      heading: Cesium.Math.toRadians(45), // 45度角更有立体感
      pitch: Cesium.Math.toRadians(-30),
      roll: 0,
    },
  });

  // 7. Enable Bloom Effect
  if (viewer.scene.postProcessStages.bloom) {
    viewer.scene.postProcessStages.bloom.enabled = true;
    viewer.scene.postProcessStages.bloom.uniforms.contrast = 119;
    viewer.scene.postProcessStages.bloom.uniforms.brightness = -0.1;
  }

  // 8. 添加大气效果
  viewer.scene.globe.showGroundAtmosphere = true;

  console.log(`Viewing: ${currentCity.value.name}`);
});
</script>

<template>
  <div class="w-full h-full relative overflow-hidden">
    <div ref="container" class="w-full h-full"></div>

    <!-- 城市切换控制 -->
    <div class="absolute top-6 right-6 z-50">
      <el-dropdown @command="changeCity" trigger="click">
        <el-button
          type="primary"
          class="!bg-slate-900/80 !backdrop-blur !border-cyan-500/30 hover:!border-cyan-500/80 !text-cyan-400 shadow-lg shadow-black/50"
        >
          <el-icon class="mr-2"><Location /></el-icon>
          {{ currentCity.name }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="!bg-slate-900/90 !border-slate-700">
            <el-dropdown-item
              command="shanghai"
              class="!text-slate-300 hover:!text-cyan-400 hover:!bg-slate-800"
              >上海 (Shanghai)</el-dropdown-item
            >
            <el-dropdown-item
              command="beijing"
              class="!text-slate-300 hover:!text-cyan-400 hover:!bg-slate-800"
              >北京 (Beijing)</el-dropdown-item
            >
            <el-dropdown-item
              command="shenzhen"
              class="!text-slate-300 hover:!text-cyan-400 hover:!bg-slate-800"
              >深圳 (Shenzhen)</el-dropdown-item
            >
            <el-dropdown-item
              command="newyork"
              class="!text-slate-300 hover:!text-cyan-400 hover:!bg-slate-800"
              >纽约 (New York)</el-dropdown-item
            >
            <el-dropdown-item
              divided
              command="xinyang"
              class="!text-slate-300 hover:!text-cyan-400 hover:!bg-slate-800"
              >信阳 (Xinyang)</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style>
/* Override standard Cesium Widget styles if needed */
.cesium-widget,
.cesium-widget canvas {
  width: 100%;
  height: 100%;
}
</style>
