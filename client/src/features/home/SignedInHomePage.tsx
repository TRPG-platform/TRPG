import TopNav from '../../components/TopNav';
import RecruitingSection from './RecruitingSection';
import SignedInHero from './SignedInHero';
import './SignedInHomePage.css';

/** 登入後首頁（#19，Figma TV-2）：導覽列＋精簡主視覺＋近期開團。 */
export default function SignedInHomePage() {
  return (
    <div className="signed-in-home">
      <TopNav current="home" />
      <main>
        <SignedInHero />
        <RecruitingSection />
      </main>
    </div>
  );
}
