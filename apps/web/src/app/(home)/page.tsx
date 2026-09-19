import {
  type AutoScrollingCarouselItem,
  AutoScrollingClientCarousel,
} from '@/components/ui/auto-scrolling-client-carousel';
import Bento from './_components/bento';
import FAQs from './_components/faq';
import FeatureTabs from './_components/feature-tabs';
import Hero from './_components/hero';
import HowItWorks from './_components/how-it-works';
import Testimonials from './_components/testimonials';

const LOGO_CLS =
  'w-auto opacity-65 [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)] transition-opacity hover:opacity-100';

const clients: AutoScrollingCarouselItem[] = [
  {
    name: 'Bitbucket',
    logo: (
      <img
        src='/logos/bitbucket.svg'
        alt='Bitbucket'
        className={`h-5 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Gumroad',
    logo: (
      <img
        src='/logos/gumroad.svg'
        alt='Gumroad'
        className={`h-5 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Gong',
    logo: (
      <img src='/logos/gong.svg' alt='Gong' className={`h-7 ${LOGO_CLS}`} />
    ),
  },
  {
    name: 'Geckoboard',
    logo: (
      <img
        src='/logos/geckoboard.svg'
        alt='Geckoboard'
        className={`h-6 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Ternary',
    logo: (
      <img
        src='/logos/ternary.svg'
        alt='Ternary'
        className={`h-6 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Wyre',
    logo: (
      <img src='/logos/wyre.svg' alt='Wyre' className={`h-6 ${LOGO_CLS}`} />
    ),
  },
  {
    name: 'Percy',
    logo: (
      <img src='/logos/percy.svg' alt='Percy' className={`h-6 ${LOGO_CLS}`} />
    ),
  },
  {
    name: 'Urban',
    logo: (
      <img src='/logos/urban.svg' alt='Urban' className={`h-6 ${LOGO_CLS}`} />
    ),
  },
  {
    name: 'Cosmos',
    logo: (
      <img src='/logos/cosmos.svg' alt='Cosmos' className={`h-5 ${LOGO_CLS}`} />
    ),
  },
  {
    name: 'Sleepy Cat',
    logo: (
      <img
        src='/logos/sleepy-cat.svg'
        alt='Sleepy Cat'
        className={`h-7 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Getform',
    logo: (
      <img
        src='/logos/getform.svg'
        alt='Getform'
        className={`h-5 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Coinflect',
    logo: (
      <img
        src='/logos/coinflect.svg'
        alt='Coinflect'
        className={`h-6 ${LOGO_CLS}`}
      />
    ),
  },
  {
    name: 'Reform Collective',
    logo: (
      <img
        src='/logos/reform-collective.svg'
        alt='Reform Collective'
        className={`h-5 ${LOGO_CLS}`}
      />
    ),
  },
];

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Hero />
      <AutoScrollingClientCarousel
        clients={clients}
        title='Trusted by leading teams'
      />
      <HowItWorks />
      <Bento />
      <FeatureTabs />
      <Testimonials />
      <FAQs />
    </div>
  );
}
