const osmRead = require("osm-read");
const fs = require("fs-extra");
const path = require("path");

const inputFile = path.join(__dirname, "../osm/henan-251126.osm.pbf");
const outputFile = path.join(
  __dirname,
  "../public/data/xinyang-buildings.geojson"
);

// 信阳大概范围 (简化矩形)
// 左下: 113.8, 32.0
// 右上: 114.4, 32.4
const BOUNDS = {
  minLon: 114.0,
  maxLon: 114.2,
  minLat: 32.0,
  maxLat: 32.3,
};

const nodes = new Map();
const buildings = [];

console.log("开始解析 OSM PBF...");

osmRead.parse({
  filePath: inputFile,
  format: "pbf",

  node: (node) => {
    // 只缓存边界内的点，减少内存占用
    if (
      node.lon >= BOUNDS.minLon &&
      node.lon <= BOUNDS.maxLon &&
      node.lat >= BOUNDS.minLat &&
      node.lat <= BOUNDS.maxLat
    ) {
      nodes.set(node.id, [node.lon, node.lat]);
    }
  },

  way: (way) => {
    // 检查是否有 building 标签
    if (way.tags.building) {
      const coordinates = [];
      let valid = true;

      for (const nodeId of way.nodeRefs) {
        const coord = nodes.get(nodeId);
        if (coord) {
          coordinates.push(coord);
        } else {
          // 如果有点缺失（可能在边界外），则跳过该建筑
          valid = false;
          break;
        }
      }

      if (valid && coordinates.length > 2) {
        // 简单的建筑高度估算
        let height = 10; // 默认高度
        if (way.tags.height) {
          height = parseFloat(way.tags.height);
        } else if (way.tags["building:levels"]) {
          height = parseInt(way.tags["building:levels"]) * 3.5;
        } else {
          // 随机高度增加一点视觉变化
          height = 10 + Math.random() * 15;
        }

        buildings.push({
          type: "Feature",
          properties: {
            height: height,
            type: way.tags.building,
            name: way.tags.name || "Unknown",
          },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        });
      }
    }
  },

  endDocument: () => {
    console.log(`解析完成! 找到 ${buildings.length} 个建筑。`);

    const geojson = {
      type: "FeatureCollection",
      features: buildings,
    };

    fs.ensureDirSync(path.dirname(outputFile));
    fs.writeJsonSync(outputFile, geojson);
    console.log(`已保存到: ${outputFile}`);
  },

  error: (err) => {
    console.error("解析错误:", err);
  },
});
