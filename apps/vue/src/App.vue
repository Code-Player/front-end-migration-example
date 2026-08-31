<script setup>
import { computed } from 'vue'

const pages = [
  { eyebrow: 'Migration workspace', title: '팀의 프론트엔드를\n안전하게 전환하세요', text: '동일한 사용자 경험을 유지하면서 Vue 화면을 React로 점진적으로 교체하는 예제입니다.' },
  { eyebrow: 'Shared experience', title: '하나의 서비스처럼\n자연스럽게 이동하세요', text: '프레임워크가 달라도 공통 내비게이션과 디자인을 사용해 전환 경계를 감춥니다.' },
  { eyebrow: 'Routing strategy', title: '라우팅 결정은\nNginx에 맡기세요', text: '사용자는 프레임워크를 알 필요 없이 같은 URL 체계 안에서 새로운 구현으로 이동합니다.' },
  { eyebrow: 'Migration complete', title: '작게 시작하고\n확실하게 전환하세요', text: '페이지 단위로 소유권을 변경하면서 서비스 중단 없이 마이그레이션 범위를 넓힐 수 있습니다.' }
]
const currentPath = window.location.pathname
const page = computed(() => Number(currentPath.match(/page-(\d)/)?.[1] || 1))
const content = computed(() => pages[page.value - 1] || pages[0])
</script>

<template>
  <main>
    <nav>
      <a class="brand" href="/vue/page-1"><span>M</span> Migration Lab</a>
      <div class="links">
        <a v-for="number in 4" :key="number" :class="{active: page === number}" :href="`/page-${number}`">Page {{ number }}로 이동</a>
      </div>
    </nav>
    <section class="hero">
      <div>
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h1>{{ content.title }}</h1>
        <p class="description">{{ content.text }}</p>
        <div class="actions">
          <a class="primary" :href="`/react/page-${page}`">같은 React 페이지로 이동 →</a>
          <span class="badge"><i></i> Vue 3에서 렌더링 중</span>
        </div>
      </div>
      <div class="card">
        <div class="window"><b></b><b></b><b></b></div>
        <div class="metric"><span>Migration progress</span><strong>{{ page * 25 }}%</strong></div>
        <div class="bar"><i :style="{width: `${page * 25}%`}"></i></div>
        <div class="frameworks"><div><small>Current</small><strong>Vue</strong></div><span>→</span><div><small>Target</small><strong>React</strong></div></div>
      </div>
    </section>
    <footer>현재 경로 <code>{{ currentPath }}</code> · Nginx 단일 진입점</footer>
  </main>
</template>
