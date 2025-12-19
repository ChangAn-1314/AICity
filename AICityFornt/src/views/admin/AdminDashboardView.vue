<template>
  <AdminLayout @close="handleClose" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';

const router = useRouter();

const handleClose = () => {
  router.push('/');
};
</script>
