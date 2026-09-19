import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Link as LinkIcon, Plus, Signature, Circle, Check, Play } from 'lucide-react';

// Corner Cross Decoration Component
const CornerCross = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const positionClasses = {
    'top-left': '-translate-[calc(50%-0.5px)]',
    'top-right': 'right-0 -translate-y-[calc(50%-0.5px)] translate-x-[calc(50%-0.5px)]',
    'bottom-left': 'bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]',
    'bottom-right': 'bottom-0 right-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]',
  };

  return (
    <div
      aria-hidden="true"
      className={`mask-radial-from-15% before:bg-foreground/25 after:bg-foreground/25 absolute size-3 before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px ${positionClasses[position]}`}
    />
  );
};

// Inner Cross for grid cells
const InnerCross = ({ position }: { position: 'bottom-left' }) => {
  const positionClasses = {
    'bottom-left': 'bottom-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]',
  };

  return (
    <div
      aria-hidden="true"
      className={`mask-radial-from-15% before:bg-foreground/25 after:bg-foreground/25 absolute size-3 before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px ${positionClasses[position]}`}
    />
  );
};

// IDE Logo Components
const IntelliJLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" width="1em" height="1em" className="size-5">
    <defs>
      <linearGradient x1="37%" y1="51%" x2="178.1%" y2="41.9%" id="intellij-a">
        <stop stopColor="#FC801D" offset="9%" />
        <stop stopColor="#B07F61" offset="23%" />
        <stop stopColor="#577DB3" offset="41%" />
        <stop stopColor="#1E7CE6" offset="53%" />
        <stop stopColor="#087CFA" offset="59%" />
      </linearGradient>
      <linearGradient x1="73.6%" y1="114.8%" x2="35.6%" y2="1.1%" id="intellij-b">
        <stop stopColor="#FE2857" offset="0%" />
        <stop stopColor="#CB3979" offset="8%" />
        <stop stopColor="#9E4997" offset="16%" />
        <stop stopColor="#7557B2" offset="25%" />
        <stop stopColor="#5362C8" offset="34%" />
        <stop stopColor="#386CDA" offset="44%" />
        <stop stopColor="#2373E8" offset="54%" />
        <stop stopColor="#1478F2" offset="66%" />
        <stop stopColor="#0B7BF8" offset="79%" />
        <stop stopColor="#087CFA" offset="100%" />
      </linearGradient>
      <linearGradient x1="28.6%" y1="23.6%" x2="81.8%" y2="129.8%" id="intellij-c">
        <stop stopColor="#FE2857" offset="0%" />
        <stop stopColor="#FE295F" offset="8%" />
        <stop stopColor="#FF2D76" offset="21%" />
        <stop stopColor="#FF318C" offset="30%" />
        <stop stopColor="#EA3896" offset="38%" />
        <stop stopColor="#B248AE" offset="55%" />
        <stop stopColor="#5A63D6" offset="79%" />
        <stop stopColor="#087CFA" offset="100%" />
      </linearGradient>
    </defs>
    <path fill="url(#intellij-a)" d="M40.5 180.6 2.9 150.8l22.1-41 33.3 11.1z" />
    <path fill="#087CFA" d="m256 68.2-4.6 148.3-98.6 39.5-53.7-34.7z" />
    <path fill="url(#intellij-b)" d="m256 68.2-48.8 47.6L144.5 39l31-34.8z" />
    <path fill="url(#intellij-c)" d="m99.1 221.3-78.5 28.4 16.5-57.5 21.2-71.3L0 101.4 37.1 0l83.8 9.9 86.3 105.9z" />
    <path d="M49.1 48h160v160h-160z" />
    <path d="M69 177.8h60v10H69v-10ZM99 79V68H69.2v11h8.4v37.7h-8.4v11H99v-11h-8.3V79H99Zm28.5 49.4.2.1c-4.1.2-8.1-.8-11.8-2.6a27 27 0 0 1-7.7-6.3l8.2-9.2c1.5 1.7 3.2 3.1 5.2 4.3 1.7 1.1 3.7 1.7 5.7 1.6 2.2.2 4.3-.7 5.8-2.3a11 11 0 0 0 2.2-7.5V68h13.3v39a27 27 0 0 1-1.5 9.4c-1.7 5-5.7 9-10.8 10.6-2.8 1-5.8 1.5-8.8 1.4Z" fill="#FFF" />
  </svg>
);

const VSCodeLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width="1em" height="1em" className="size-5">
    <mask id="vscode-a" width="100" height="100" x="0" y="0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse">
      <path fill="#fff" fillRule="evenodd" d="M70.912 99.317a6.223 6.223 0 0 0 4.96-.19l20.589-9.907A6.25 6.25 0 0 0 100 83.587V16.413a6.25 6.25 0 0 0-3.54-5.632L75.874.874a6.226 6.226 0 0 0-7.104 1.21L29.355 38.04 12.187 25.01a4.162 4.162 0 0 0-5.318.236l-5.506 5.009a4.168 4.168 0 0 0-.004 6.162L16.247 50 1.36 63.583a4.168 4.168 0 0 0 .004 6.162l5.506 5.01a4.162 4.162 0 0 0 5.318.236l17.168-13.032L68.77 97.917a6.217 6.217 0 0 0 2.143 1.4ZM75.015 27.3 45.11 50l29.906 22.701V27.3Z" clipRule="evenodd" />
    </mask>
    <g mask="url(#vscode-a)">
      <path fill="#0065A9" d="M96.461 10.796 75.857.876a6.23 6.23 0 0 0-7.107 1.207l-67.451 61.5a4.167 4.167 0 0 0 .004 6.162l5.51 5.009a4.167 4.167 0 0 0 5.32.236l81.228-61.62c2.725-2.067 6.639-.124 6.639 3.297v-.24a6.25 6.25 0 0 0-3.539-5.63Z" />
      <g filter="url(#vscode-b)">
        <path fill="#007ACC" d="m96.461 89.204-20.604 9.92a6.229 6.229 0 0 1-7.107-1.207l-67.451-61.5a4.167 4.167 0 0 1 .004-6.162l5.51-5.009a4.167 4.167 0 0 1 5.32-.236l81.228 61.62c2.725 2.067 6.639.124 6.639-3.297v.24a6.25 6.25 0 0 1-3.539 5.63Z" />
      </g>
      <g filter="url(#vscode-c)">
        <path fill="#1F9CF0" d="M75.858 99.126a6.232 6.232 0 0 1-7.108-1.21c2.306 2.307 6.25.674 6.25-2.588V4.672c0-3.262-3.944-4.895-6.25-2.589a6.232 6.232 0 0 1 7.108-1.21l20.6 9.908A6.25 6.25 0 0 1 100 16.413v67.174a6.25 6.25 0 0 1-3.541 5.633l-20.601 9.906Z" />
      </g>
      <path fill="url(#vscode-d)" fillRule="evenodd" d="M70.851 99.317a6.224 6.224 0 0 0 4.96-.19L96.4 89.22a6.25 6.25 0 0 0 3.54-5.633V16.413a6.25 6.25 0 0 0-3.54-5.632L75.812.874a6.226 6.226 0 0 0-7.104 1.21L29.294 38.04 12.126 25.01a4.162 4.162 0 0 0-5.317.236l-5.507 5.009a4.168 4.168 0 0 0-.004 6.162L16.186 50 1.298 63.583a4.168 4.168 0 0 0 .004 6.162l5.507 5.009a4.162 4.162 0 0 0 5.317.236L29.294 61.96l39.414 35.958a6.218 6.218 0 0 0 2.143 1.4ZM74.954 27.3 45.048 50l29.906 22.701V27.3Z" clipRule="evenodd" opacity="0.25" style={{ mixBlendMode: 'overlay' }} />
    </g>
    <defs>
      <filter id="vscode-b" width="116.727" height="92.246" x="-8.394" y="15.829" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset />
        <feGaussianBlur stdDeviation="4.167" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend in2="BackgroundImageFix" mode="overlay" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter id="vscode-c" width="47.917" height="116.151" x="60.417" y="-8.076" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset />
        <feGaussianBlur stdDeviation="4.167" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend in2="BackgroundImageFix" mode="overlay" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <linearGradient id="vscode-d" x1="49.939" x2="49.939" y1="0.258" y2="99.742" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const WindsurfLogo = () => (
  <svg className="size-5" viewBox="0 0 1024 1024" fill="none">
    <path
      d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z"
      fill="currentColor"
    />
  </svg>
);

// Invoice Logo
const InvoiceLogo = () => (
  <svg className="size-5" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M80 100H28C12.536 100 0 87.464 0 72V28C0 12.536 12.536 0 28 0H72C87.464 0 100 12.536 100 28V80H160C171.046 80 180 88.9543 180 100V167.639C180 175.215 175.72 182.14 168.944 185.528L103.416 218.292C101.17 219.415 98.6923 220 96.1803 220C87.2442 220 80 212.756 80 203.82V100ZM28 20C23.5817 20 20 23.5817 20 28V72C20 76.4183 23.5817 80 28 80H80V28C80 23.5817 76.4183 20 72 20H28ZM100 100H152C156.418 100 160 103.582 160 108V165.092C160 168.103 158.309 170.859 155.625 172.224L111.625 194.591C106.303 197.296 100 193.429 100 187.459V100Z"
      fill="url(#paint_logo)"
    />
    <defs>
      <linearGradient id="paint_logo" x1="90" y1="0" x2="90" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9B99FE" />
        <stop offset="1" stopColor="#2BC8B7" />
      </linearGradient>
    </defs>
  </svg>
);

// Gemini Logo
const GeminiLogo = () => (
  <svg viewBox="0 0 296 298" fill="none" className="size-4">
    <mask id="gemini__a" width="296" height="298" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
      <path fill="#3186FF" d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z" />
    </mask>
    <g mask="url(#gemini__a)">
      <g filter="url(#gemini__b)">
        <ellipse cx="163" cy="149" fill="#3689FF" rx="196" ry="159" />
      </g>
      <g filter="url(#gemini__c)">
        <ellipse cx="33.5" cy="142.5" fill="#F6C013" rx="68.5" ry="72.5" />
      </g>
      <g filter="url(#gemini__d)">
        <ellipse cx="19.5" cy="148.5" fill="#F6C013" rx="68.5" ry="72.5" />
      </g>
      <g filter="url(#gemini__e)">
        <path fill="#FA4340" d="M194 10.5C172 82.5 65.5 134.333 22.5 135L144-66l50 76.5Z" />
      </g>
      <g filter="url(#gemini__f)">
        <path fill="#FA4340" d="M190.5-12.5C168.5 59.5 62 111.333 19 112L140.5-89l50 76.5Z" />
      </g>
      <g filter="url(#gemini__g)">
        <path fill="#14BB69" d="M194.5 279.5C172.5 207.5 66 155.667 23 155l121.5 201 50-76.5Z" />
      </g>
      <g filter="url(#gemini__h)">
        <path fill="#14BB69" d="M196.5 320.5C174.5 248.5 68 196.667 25 196l121.5 201 50-76.5Z" />
      </g>
    </g>
    <defs>
      <filter id="gemini__b" width="464" height="390" x="-69" y="-46" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="18" />
      </filter>
      <filter id="gemini__c" width="265" height="273" x="-99" y="6" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
      </filter>
      <filter id="gemini__d" width="265" height="273" x="-113" y="12" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
      </filter>
      <filter id="gemini__e" width="299.5" height="329" x="-41.5" y="-130" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
      </filter>
      <filter id="gemini__f" width="299.5" height="329" x="-45" y="-153" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
      </filter>
      <filter id="gemini__g" width="299.5" height="329" x="-41" y="91" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
      </filter>
      <filter id="gemini__h" width="299.5" height="329" x="-39" y="132" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
      </filter>
    </defs>
  </svg>
);

// Replit Logo
const ReplitLogo = () => (
  <svg viewBox="0 0 20 24" fill="none" className="size-5">
    <path d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z" fill="#F26207" />
    <path d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z" fill="#F26207" />
    <path d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z" fill="#F26207" />
  </svg>
);

// Linear Logo
const LinearLogo = () => (
  <svg className="absolute inset-y-0.5 left-1 size-3.5" fill="none" viewBox="0 0 100 100">
    <path fill="#5E6AD2" d="M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597-18.425-4.323-32.93-18.827-37.252-37.252ZM.002 46.889a.99.99 0 0 0 .29.76L52.35 99.71c.201.2.478.307.76.29 2.37-.149 4.695-.46 6.963-.927.765-.157 1.03-1.096.478-1.648L2.576 39.448c-.552-.551-1.491-.286-1.648.479a50.067 50.067 0 0 0-.926 6.962ZM4.21 29.705a.988.988 0 0 0 .208 1.1l64.776 64.776c.289.29.726.375 1.1.208a49.908 49.908 0 0 0 5.185-2.684.981.981 0 0 0 .183-1.54L8.436 24.336a.981.981 0 0 0-1.541.183 49.896 49.896 0 0 0-2.684 5.185Zm8.448-11.631a.986.986 0 0 1-.045-1.354C21.78 6.46 35.111 0 49.952 0 77.592 0 100 22.407 100 50.048c0 14.84-6.46 28.172-16.72 37.338a.986.986 0 0 1-1.354-.045L12.659 18.074Z" />
  </svg>
);

// Perplexity Logo
const PerplexityLogo = () => (
  <svg viewBox="0 0 48 48" className="size-4">
    <path fill="none" stroke="#20808d" strokeLinecap="round" strokeLinejoin="round" d="M24 4.5v39M13.73 16.573v-9.99L24 16.573m0 14.5L13.73 41.417V27.01L24 16.573m0 0l10.27-9.99v9.99" />
    <path fill="none" stroke="#20808d" strokeLinecap="round" strokeLinejoin="round" d="M13.73 31.396H9.44V16.573h29.12v14.823h-4.29" />
    <path fill="none" stroke="#20808d" strokeLinecap="round" strokeLinejoin="round" d="M24 16.573L34.27 27.01v14.407L24 31.073" />
  </svg>
);

// Deepseek Logo
const DeepseekLogo = () => (
  <svg style={{ flex: '0 0 auto', lineHeight: 1 }} viewBox="0 0 24 24" className="size-4">
    <path fill="#4D6BFE" d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 0 1-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 0 1 .016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 0 1-.254-.078.253.253 0 0 1-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" />
  </svg>
);

// Mistral Logo
const MistralLogo = () => (
  <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 233" className="size-4">
    <path d="M186.18182 0h46.54545v46.54545h-46.54545z" />
    <path fill="#F7D046" d="M209.45454 0h46.54545v46.54545h-46.54545z" />
    <path d="M0 0h46.54545v46.54545H0zM0 46.54545h46.54545V93.0909H0zM0 93.09091h46.54545v46.54545H0zM0 139.63636h46.54545v46.54545H0zM0 186.18182h46.54545v46.54545H0z" />
    <path fill="#F7D046" d="M23.27273 0h46.54545v46.54545H23.27273z" />
    <path fill="#F2A73B" d="M209.45454 46.54545h46.54545V93.0909h-46.54545zM23.27273 46.54545h46.54545V93.0909H23.27273z" />
    <path d="M139.63636 46.54545h46.54545V93.0909h-46.54545z" />
    <path fill="#F2A73B" d="M162.90909 46.54545h46.54545V93.0909h-46.54545zM69.81818 46.54545h46.54545V93.0909H69.81818z" />
    <path fill="#EE792F" d="M116.36364 93.09091h46.54545v46.54545h-46.54545zM162.90909 93.09091h46.54545v46.54545h-46.54545zM69.81818 93.09091h46.54545v46.54545H69.81818z" />
    <path d="M93.09091 139.63636h46.54545v46.54545H93.09091z" />
    <path fill="#EB5829" d="M116.36364 139.63636h46.54545v46.54545h-46.54545z" />
    <path fill="#EE792F" d="M209.45454 93.09091h46.54545v46.54545h-46.54545zM23.27273 93.09091h46.54545v46.54545H23.27273z" />
    <path d="M186.18182 139.63636h46.54545v46.54545h-46.54545z" />
    <path fill="#EB5829" d="M209.45454 139.63636h46.54545v46.54545h-46.54545z" />
    <path d="M186.18182 186.18182h46.54545v46.54545h-46.54545z" />
    <path fill="#EB5829" d="M23.27273 139.63636h46.54545v46.54545H23.27273z" />
    <path fill="#EA3326" d="M209.45454 186.18182h46.54545v46.54545h-46.54545zM23.27273 186.18182h46.54545v46.54545H23.27273z" />
  </svg>
);

// Cohere Logo
const CohereLogo = () => (
  <svg xmlSpace="preserve" viewBox="0 0 75 75" className="size-4">
    <path d="M24.3 44.7c2 0 6-.1 11.6-2.4 6.5-2.7 19.3-7.5 28.6-12.5 6.5-3.5 9.3-8.1 9.3-14.3C73.8 7 66.9 0 58.3 0h-36C10 0 0 10 0 22.3s9.4 22.4 24.3 22.4z" style={{ fillRule: 'evenodd', clipRule: 'evenodd', fill: 'rgb(57, 89, 77)' }} />
    <path d="M30.4 60c0-6 3.6-11.5 9.2-13.8l11.3-4.7C62.4 36.8 75 45.2 75 57.6 75 67.2 67.2 75 57.6 75H45.3c-8.2 0-14.9-6.7-14.9-15z" style={{ fillRule: 'evenodd', clipRule: 'evenodd', fill: 'rgb(209, 142, 226)' }} />
    <path d="M12.9 47.6C5.8 47.6 0 53.4 0 60.5v1.7C0 69.2 5.8 75 12.9 75c7.1 0 12.9-5.8 12.9-12.9v-1.7c-.1-7-5.8-12.8-12.9-12.8z" style={{ fill: 'rgb(255, 119, 89)' }} />
  </svg>
);

// OpenAI Logo
const OpenAILogo = () => (
  <svg className="fill-foreground size-4" preserveAspectRatio="xMidYMid" viewBox="0 0 256 260">
    <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
  </svg>
);

// Qwen Logo
const QwenLogo = () => (
  <svg className="fill-foreground size-4" fillRule="evenodd" style={{ flex: '0 0 auto', lineHeight: 1 }} viewBox="0 0 24 24">
    <path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z" />
  </svg>
);

// Invoice Card Component
const InvoiceCard = () => (
  <div aria-hidden="true" className="relative">
    <div className="mask-b-from-65% group relative -mx-4 px-4 pt-6">
      <div className="bg-illustration ring-border-illustration relative z-10 overflow-hidden rounded-2xl p-8 text-sm shadow-xl shadow-black/10 ring-1">
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-0.5">
            <InvoiceLogo />
            <div className="mt-4 font-mono text-xs">INV-456789</div>
            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">$284,342.57</div>
            <div className="text-xs font-medium">Due in 15 days</div>
          </div>
          <div aria-hidden="true" className="bg-illustration ring-border-illustration w-16 space-y-2 rounded-md p-2 shadow-md ring-1 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]">
            <div className="flex items-center gap-1">
              <div className="bg-foreground/15 size-2.5 rounded-full" />
              <div className="bg-foreground/15 h-[3px] w-4 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <div className="bg-foreground/15 h-[3px] w-2.5 rounded-full" />
                <div className="bg-foreground/15 h-[3px] w-6 rounded-full" />
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-foreground/15 h-[3px] w-2.5 rounded-full" />
                <div className="bg-foreground/15 h-[3px] w-6 rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="bg-foreground/15 h-[3px] w-full rounded-full" />
              <div className="flex items-center gap-1">
                <div className="bg-foreground/15 h-[3px] w-2/3 rounded-full" />
                <div className="bg-foreground/15 h-[3px] w-1/3 rounded-full" />
              </div>
            </div>
            <Signature className="ml-auto size-3" />
          </div>
        </div>
        <div className="space-y-1.5 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
          <div className="grid grid-cols-[auto_1fr] items-center">
            <span className="text-muted-foreground w-18 block">To</span>
            <span className="bg-border h-2 w-1/4 rounded-full px-2" />
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center">
            <span className="text-muted-foreground w-18 block">From</span>
            <span className="bg-border h-2 w-1/2 rounded-full px-2" />
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center">
            <span className="text-muted-foreground w-18 block">Address</span>
            <span className="bg-border h-2 w-2/3 rounded-full px-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Integrations Card Component
const IntegrationsCard = () => (
  <div aria-hidden="true" className="bg-foreground/5 group rounded-2xl">
    <div className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium">
      <LinkIcon className="size-3.5 opacity-50" />
      Integrations
    </div>
    <div className="relative">
      <div className="absolute inset-0 scale-100 opacity-100 blur-lg transition-all duration-300">
        <div className="bg-linear-to-r/increasing animate-hue-rotate absolute inset-x-6 bottom-0 top-12 -translate-y-3 from-pink-400 to-purple-400" />
      </div>
      <div className="bg-card ring-foreground/10 relative overflow-hidden rounded-2xl border border-transparent px-6 py-3 shadow-md shadow-black/5 ring-1">
        {/* Gemini Integration */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
          <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">
            <GeminiLogo />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">Gemini</h3>
            <p className="text-muted-foreground line-clamp-1 text-sm">The AI model that powers Google&apos;s search engine.</p>
          </div>
          <button type="button" className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm shadow-black/10 border border-transparent bg-card ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 dark:ring-foreground/15 dark:hover:bg-muted/50 h-9 w-9">
            <Plus className="size-4" />
          </button>
        </div>
        {/* Replit Integration */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
          <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">
            <ReplitLogo />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">Replit</h3>
            <p className="text-muted-foreground line-clamp-1 text-sm">The AI model that powers Google&apos;s search engine.</p>
          </div>
          <button type="button" className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm shadow-black/10 border border-transparent bg-card ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 dark:ring-foreground/15 dark:hover:bg-muted/50 h-9 w-9">
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);


// Todo Item Component for Split Issue Card
const TodoItem = ({ text }: { text: string }) => (
  <li className="group/todo not-hover:text-muted-foreground cursor-default select-none flex items-center gap-2">
    <div className="relative size-3.5">
      <Check className="not-group-hover/todo:opacity-0 absolute inset-0 m-auto size-2 opacity-50 duration-100" strokeWidth={3} />
      <Circle className="size-3.5 opacity-50" />
    </div>
    <span>{text}</span>
  </li>
);

// Split Issue Card Component
const SplitIssueCard = () => (
  <div aria-hidden="true" className="space-y-3">
    {/* Issue Header */}
    <div className="bg-illustration text-muted-foreground ring-border-illustration shadow-black/6.5 ml-auto w-fit rounded-l-xl rounded-br rounded-tr-xl px-2.5 py-1.5 text-sm shadow ring-1">
      Process{' '}
      <span className="text-foreground relative inline-flex pl-5 pr-2">
        <LinearLogo />
        <span className="bg-foreground/5 border-foreground/5 absolute -inset-y-0.5 inset-x-0 rounded-full border" />
        <span className="line-clamp-1 font-medium">new customer signup</span>
      </span>
      {' '}workflow
    </div>

    {/* Thought indicator */}
    <div className="text-sm">
      Running <span className="text-muted-foreground">3 steps</span>
    </div>

    {/* Response with todo list */}
    <div className="space-y-2">
      <div className="text-sm">Executing onboarding workflow...</div>
      <div className="bg-illustration ring-border-illustration shadow-black/6.5 w-fit rounded-xl p-3 shadow ring-1">
        <ul className="space-y-2 text-sm">
          <TodoItem text="Enrich data with Clearbit" />
          <TodoItem text="Create CRM record" />
          <TodoItem text="Send welcome email" />
          <TodoItem text="Notify sales team" />
        </ul>
      </div>
    </div>
  </div>
);

// Model Item Component for AI Model Selector
const ModelItem = ({
  name,
  Logo,
  opacity,
  rotateX
}: {
  name: string;
  Logo: () => React.ReactElement;
  opacity: number;
  rotateX: number;
}) => (
  <div
    style={{ opacity, transform: `rotateX(${rotateX}deg)` }}
    className={`flex ${rotateX < 0 ? 'origin-top' : 'origin-bottom'} items-center gap-2 [&>svg]:size-4`}
  >
    <Logo />
    <span className="text-sm">{name}</span>
  </div>
);

// Model Selector Card Component
const ModelSelectorCard = () => (
  <div aria-hidden="true" className="mask-x-from-75% relative">
    {/* Play Button Overlay */}
    <div className="bg-muted/50 absolute inset-0 my-auto flex h-8 items-center rounded-lg border px-10">
      <Play className="fill-foreground size-2.5" />
    </div>

    {/* Models Carousel */}
    <div className="perspective-dramatic flex flex-col items-center gap-3">
      <ModelItem name="Gemini" Logo={GeminiLogo} opacity={0.6} rotateX={16} />
      <ModelItem name="Perplexity" Logo={PerplexityLogo} opacity={0.8} rotateX={8} />
      <ModelItem name="Deepseek" Logo={DeepseekLogo} opacity={1} rotateX={0} />
      <ModelItem name="Mistral" Logo={MistralLogo} opacity={1} rotateX={0} />
      <ModelItem name="Cohere" Logo={CohereLogo} opacity={1} rotateX={0} />
      <ModelItem name="OpenAI" Logo={OpenAILogo} opacity={0.8} rotateX={-8} />
      <ModelItem name="Qwen" Logo={QwenLogo} opacity={0.6} rotateX={-16} />
    </div>
  </div>
);

// User Cursor Component
const UserCursor = ({
  name,
  color,
  imageSrc
}: {
  name: string;
  color: string;
  imageSrc: string;
}) => (
  <span className="relative inline-block">
    <div
      className={`before:h-8 shadow-black/6.5 absolute top-0.5 flex -translate-x-0.5 -translate-y-full select-none items-center gap-1 rounded-r-md rounded-tl-md px-1.5 py-0.5 text-white shadow-md before:absolute before:left-0 before:top-1.5 before:w-0.5 before:rounded ${color}`}
    >
      <div className="before:border-foreground/20 relative size-3.5 overflow-hidden rounded-full before:absolute before:inset-0 before:rounded-full before:border">
        <Image
          alt={name}
          loading="lazy"
          width={16}
          height={16}
          className="size-full object-cover"
          src={imageSrc}
        />
      </div>
      <span className="truncate text-xs font-medium">{name}</span>
    </div>
  </span>
);

// Project Board Card Component
const ProjectBoardCard = () => (
  <div aria-hidden="true" className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top max-w-sm">
    <div className="mb-3 text-lg font-medium">Workflow Builder</div>
    <div className="text-muted-foreground space-y-2.5 text-sm/6">
      <div>
        Desi
        <span className="before:mask-l-from-65% bg-linear-to-r relative select-none to-indigo-500/35 text-indigo-600 before:absolute before:inset-0 before:border before:border-indigo-500/45 dark:text-indigo-300">
          gn workflows with
        </span>
        {' '}
        <UserCursor
          name="Alex"
          color="bg-primary before:bg-primary"
          imageSrc="https://avatars.githubusercontent.com/u/124599?v=4"
        />
        your team in real-time.
      </div>
      <div>
        Test, iterate, and deploy automations together{' '}
        <UserCursor
          name="Jordan"
          color="bg-emerald-600 before:bg-emerald-600"
          imageSrc="https://avatars.githubusercontent.com/u/47919550?v=4"
        />
        with live collaboration.
      </div>
    </div>
  </div>
);

// Feature Showcase Card Component
const FeatureShowcaseCard = () => (
  <div className="overflow-hidden bg-card/50">
    <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-border">
      {/* Split Issue into Tasks */}
      <div className="grid grid-rows-[1fr_auto] divide-b divide-dashed divide-border">
        <div className="flex items-center justify-center p-5 overflow-hidden">
          <SplitIssueCard />
        </div>
        <div className="flex flex-col items-center justify-center p-5 text-center">
          <h3 className="text-balance font-semibold">AI-Powered Actions</h3>
          <p className="text-muted-foreground mt-2 text-balance text-sm">
            Let AI analyze, decide, and execute complex workflow steps automatically.
          </p>
        </div>
      </div>

      {/* AI Model Selector */}
      <div className="grid grid-rows-[1fr_auto] divide-b divide-dashed divide-border">
        <div className="flex items-center justify-center p-5 overflow-hidden">
          <ModelSelectorCard />
        </div>
        <div className="flex flex-col items-center justify-center p-5 text-center">
          <h3 className="text-balance font-semibold">Any AI Model, One Platform</h3>
          <p className="text-muted-foreground mt-2 text-balance text-sm">
            Use OpenAI, Gemini, Claude, or any model to power your automations.
          </p>
        </div>
      </div>

      {/* Project Board Collaboration */}
      <div className="grid grid-rows-[1fr_auto] divide-b divide-dashed divide-border">
        <div className="flex items-center justify-center p-5 overflow-hidden">
          <ProjectBoardCard />
        </div>
        <div className="flex flex-col items-center justify-center p-5 text-center">
          <h3 className="text-balance font-semibold">Team Collaboration</h3>
          <p className="text-muted-foreground mt-2 text-balance text-sm">
            Build, test, and deploy workflows together with your team.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Features = () => (
  <div className="relative">
    {/* Corner Decorations */}
    <CornerCross position="top-left" />
    <CornerCross position="top-right" />
    <CornerCross position="bottom-left" />
    <CornerCross position="bottom-right" />

      {/* Main Grid */}
      <div className="border-foreground/10 relative grid grid-cols-2 overflow-hidden border-y border-dashed lg:grid-cols-4 [&>*]:p-4 lg:[&>*]:p-8 [&>*:nth-child(-n+4)]:border-b [&>*:nth-child(-n+4)]:border-dashed lg:[&>*:nth-child(-n+2)]:border-b-0 lg:[&>*:nth-child(-n+5)]:border-b lg:[&>*:nth-child(-n+5)]:border-dashed [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-dashed lg:[&>*:nth-child(odd)]:border-r-0 lg:[&>*:nth-child(1)]:border-r lg:[&>*:nth-child(1)]:border-dashed lg:[&>*:nth-child(2)]:border-r lg:[&>*:nth-child(2)]:border-dashed lg:[&>*:nth-child(3)]:border-r lg:[&>*:nth-child(3)]:border-dashed">
        {/* Header Section - Full Width */}
        <div className="col-span-full !border-r-0 !border-b">
          <div className="mx-auto max-w-xl pt-8 text-center">
            <h2 className="text-balance text-4xl font-semibold">Everything you need to automate workflows</h2>
            <p className="text-muted-foreground my-6 text-balance text-lg">
              Build powerful automations with a visual workflow builder. Connect AI models, integrate your tools, and orchestrate complex processes with ease.
            </p>
            <Link
              className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm shadow-black/10 border border-transparent bg-card ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 dark:ring-foreground/15 dark:hover:bg-muted/50 h-8 rounded-md px-3 text-xs"
              href="/pricing"
            >
              Get Started
            </Link>
          </div>

          {/* IDE Showcase */}
          <div className="relative">
            <div className="absolute inset-x-0 bottom-4 z-10 mx-auto max-w-56 space-y-3">
              <h3 className="text-center font-medium">Works with your tools</h3>
              <div className="grid grid-cols-3 gap-0.5 [&>*]:bg-foreground/5 [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:rounded [&>*]:px-2 [&>*]:py-3">
                <div className="!rounded-l-lg">
                  <IntelliJLogo />
                </div>
                <div>
                  <VSCodeLogo />
                </div>
                <div className="!rounded-r-lg">
                  <WindsurfLogo />
                </div>
              </div>
            </div>

            {/* App Screenshot */}
            <div className="mask-b-from-35% mx-auto mt-16 max-w-4xl px-4 pt-1 lg:px-8">
              <div className="bg-background rounded-(--radius) ring-border-illustration relative h-64 overflow-hidden border border-transparent shadow-xl shadow-black/10 ring-1 lg:h-80">
                <Image
                  alt="app screen"
                  loading="lazy"
                  width={2880}
                  height={1842}
                  className="object-top-left size-full object-cover"
                  src="https://res.cloudinary.com/dohqjvu9k/image/upload/v1755171585/tailark_zazuhl.png"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard Card */}
        <div className="col-span-2 row-span-2 grid grid-rows-subgrid gap-8 !p-8 !border-r">
          <div className="mx-auto w-full max-w-84 self-center">
            <InvoiceCard />
          </div>
          <div className="mx-auto max-w-sm text-center">
            <h3 className="text-balance font-semibold">Workflow analytics & insights</h3>
            <p className="text-muted-foreground mt-3">
              Monitor automation performance with real-time metrics. Track success rates, execution times, and identify bottlenecks.
            </p>
          </div>
        </div>

        {/* Integrations Card */}
        <div className="relative col-span-2 row-span-2 grid grid-rows-subgrid gap-8 !p-8">
          <InnerCross position="bottom-left" />
          <div className="mx-auto max-w-sm self-center lg:px-8">
            <IntegrationsCard />
          </div>
          <div className="relative z-10 mx-auto max-w-sm text-center">
            <h3 className="text-balance font-semibold">100+ native integrations</h3>
            <p className="text-muted-foreground mt-3">
              Connect to Slack, Notion, Salesforce, HubSpot, and more. Trigger workflows from any event across your stack.
            </p>
          </div>
        </div>
        {/* Testimonial Section */}
        <div className="col-span-full relative">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative py-24 px-8 lg:py-32">
            <blockquote className="mx-auto max-w-4xl text-center">
              <p className="text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl lg:text-4xl lg:leading-relaxed">
                &ldquo;Folio cut our ad-hoc data requests by 80%. The team now answers their own questions in plain English instead of waiting two days for an analyst.&rdquo;
              </p>
              <footer className="mt-10">
                <p className="font-semibold">Sarah Mitchell</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Head of Operations · TechScale Inc.
                </p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

    {/* Feature Showcase Card - 3 Column */}
    <div>
      <FeatureShowcaseCard />
    </div>
  </div>
);

export default Features;
