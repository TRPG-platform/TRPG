import TopNav from '../../components/TopNav';
import HomeHero from './HomeHero';
import './HomePage.css';

/** 首頁（#16，Figma TV-1）：導覽列＋主視覺區。 */
export default function HomePage() {
  return (
    <div className="home-page">
      <TopNav current="home" />
      <main className="home-page__main">
        <HomeHero />
      </main>
    </div>
  );
}
