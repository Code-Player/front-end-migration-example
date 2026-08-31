import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const pages = [
  { eyebrow: 'Migration workspace', title: '팀의 프론트엔드를\n안전하게 전환하세요', text: '동일한 사용자 경험을 유지하면서 Vue 화면을 React로 점진적으로 교체하는 예제입니다.' },
  { eyebrow: 'Shared experience', title: '하나의 서비스처럼\n자연스럽게 이동하세요', text: '프레임워크가 달라도 공통 내비게이션과 디자인을 사용해 전환 경계를 감춥니다.' },
  { eyebrow: 'Routing strategy', title: '라우팅 결정은\nNginx에 맡기세요', text: '사용자는 프레임워크를 알 필요 없이 같은 URL 체계 안에서 새로운 구현으로 이동합니다.' },
  { eyebrow: 'Migration complete', title: '작게 시작하고\n확실하게 전환하세요', text: '페이지 단위로 소유권을 변경하면서 서비스 중단 없이 마이그레이션 범위를 넓힐 수 있습니다.' }
]
const page = Number(location.pathname.match(/page-(\d)/)?.[1] || 1)
const content = pages[page - 1] || pages[0]

function App() {
  return <main>
    <nav>
      <a className="brand" href="/vue/page-1"><span>M</span> Migration Lab</a>
      <div className="links">{[1, 2, 3, 4].map(number => <a key={number} className={page === number ? 'active' : ''} href={`/page-${number}`}>Page {number}로 이동</a>)}</div>
    </nav>
    <section className="hero">
      <div><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p className="description">{content.text}</p>
        <div className="actions"><a className="primary" href={`/vue/page-${page}`}>같은 Vue 페이지로 이동 →</a><span className="badge"><i></i> React 18에서 렌더링 중</span></div>
      </div>
      <div className="card"><div className="window"><b></b><b></b><b></b></div><div className="metric"><span>Migration progress</span><strong>{page * 25}%</strong></div><div className="bar"><i style={{width: `${page * 25}%`}}></i></div><div className="frameworks"><div><small>Previous</small><strong>Vue</strong></div><span>→</span><div><small>Current</small><strong>React</strong></div></div></div>
    </section><footer>현재 경로 <code>{location.pathname}</code> · Nginx 단일 진입점</footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
