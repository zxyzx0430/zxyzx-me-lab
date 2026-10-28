import { M01Hero } from '../modules/m01/M01Hero';
import { usePageNavigation } from '../shared/navigation/usePageNavigation';
import { motion } from 'motion/react';
export function App() {
  usePageNavigation(['top', 'world']);
  return <>
    <a className="skip" href="#world">跳过首页开场</a>
    <header className="nav" aria-label="站点导航">
      <a href="#top" className="brand" aria-label="忠心于中心，返回开场"><span className="brand-name">忠心于中心</span><span className="brand-small">ZXYZX.ME</span></a>
      <nav className="navitems" aria-label="个人站导航"><span className="nav-note">PERSONAL DIGITAL SPACE / 2026</span><a href="#world">WORK</a><a href="#world-details">ABOUT</a></nav>
    </header>
    <main>
      <M01Hero />
      <section className="next" id="world" aria-label="作品世界过渡示意">
        <div><span className="index">01 / EXPLORE THE WORLD</span><h2>让思想，<br/>发生。</h2></div>
        <div id="world-details"><p className="description">向内理解自己，向外走进问题。</p><p>我关心学习、经济、技术和真实生活，也尝试把研究变成可以实践的系统。</p>
          <div className="project-hint" aria-label="未来的独立项目入口">
            <motion.div whileHover={{x:4}}>01　PERSONAL AI SYSTEM <i>学习与认知</i></motion.div>
            <motion.div whileHover={{x:4}}>02　OPEN MARGIN <i>经济与财务</i></motion.div>
            <motion.div whileHover={{x:4}}>03　HARDWARE RAG AGENT <i>技术与实践</i></motion.div>
          </div>
          <div className="review-note">M01 REACT PREVIEW / M02 CONTENT IS NOT APPROVED.<br/>此页是独立实验预览，不会替换已冻结的网站与模块。</div>
        </div>
      </section>
    </main>
    <footer className="page-footer"><span>忠心于中心 / THE PERSON BEHIND THE SYSTEM</span><span>REACT M01 · UNAPPROVED PREVIEW</span></footer>
  </>;
}
