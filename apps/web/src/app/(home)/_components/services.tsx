'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  LassoSelect,
  Brain,
  Plus,
  Ellipsis,
  Flag,
  MessageSquare,
  Paperclip,
} from 'lucide-react';

// Email Composition Card Content
const EmailCompositionContent = () => (
  <div className="overflow-hidden">
    <div className="[&>*]:scale-95 sm:py-12">
      <div
        aria-hidden="true"
        className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left min-w-xs relative pl-6 pt-1"
      >
        <div className="bg-card ring-border-illustration rounded-2xl p-6 pb-16 pt-2 shadow-xl shadow-black/10 ring-1">
          <div className="divide-y border-b text-xs [&>*]:flex [&>*]:h-10 [&>*]:items-center [&>*]:py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-foreground/50">To:</span>
                <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex cursor-pointer gap-1 rounded-full p-0.5 pr-2.5 shadow-md ring-1">
                  <div className="before:border-foreground/20 relative size-4 overflow-hidden rounded-full before:absolute before:inset-0 before:rounded-full before:border">
                    <Image
                      alt="Shadcn"
                      loading="lazy"
                      width={20}
                      height={20}
                      src="https://avatars.githubusercontent.com/u/124599?v=4"
                    />
                  </div>
                  <span className="text-xs font-medium">Shadcn</span>
                </div>
              </div>
              <div className="bg-foreground/10 flex size-6 rounded-full border">
                <Plus className="m-auto size-3.5" strokeWidth={3} />
              </div>
            </div>
            <div className="flex gap-1">
              <span className="text-foreground/50">Cc:</span>
            </div>
            <div className="flex gap-1">
              <span className="text-foreground/50">Subject:</span>
            </div>
            <div className="flex gap-1">
              <span className="text-foreground/50">From:</span>
            </div>
          </div>
          <div className="text-muted-foreground mt-6 space-y-2 text-sm/6">
            <p>
              Web applications with{' '}
              <span className="bg-linear-to-r from-primary rounded to-emerald-500 bg-clip-text px-0.5 text-transparent">
                React and TypeScript
              </span>{' '}
              using best practices.
            </p>
            <p className="mt-3">Sent from my iPhone</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Task Management Card Content
const TaskManagementContent = () => (
  <div className="overflow-hidden">
    <div className="[&>*]:origin-left [&>*]:scale-90 sm:py-6">
      <div
        aria-hidden="true"
        className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left pl-6 pt-1"
      >
        <div className="bg-card/50 ring-border-illustration shadow-black/6.5 min-w-xs rounded-2xl p-2 shadow-xl ring-1">
          <div className="mb-2 flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold">In Progress</span>
            </div>
            <Ellipsis className="text-muted-foreground size-4" />
          </div>
          <div className="space-y-2 [&>*]:rounded-xl">
            {/* Task 1 */}
            <div className="bg-illustration ring-border-illustration p-3 ring-1">
              <div className="mb-2 flex items-start justify-between">
                <div className="text-sm font-medium">API Integration</div>
                <Flag className="size-3.5 fill-red-500 text-red-500" />
              </div>
              <p className="text-muted-foreground mb-3 text-xs">
                Connect payment gateway endpoints
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                    <Image
                      alt="User 1"
                      loading="lazy"
                      width={20}
                      height={20}
                      src="https://avatars.githubusercontent.com/u/47919550?v=4"
                    />
                  </div>
                  <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                    <Image
                      alt="User 2"
                      loading="lazy"
                      width={20}
                      height={20}
                      src="https://avatars.githubusercontent.com/u/124599?v=4"
                    />
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="size-3" />4
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Paperclip className="size-3" />2
                  </span>
                </div>
              </div>
            </div>
            {/* Task 2 */}
            <div className="bg-illustration ring-border-illustration p-3 ring-1">
              <div className="mb-2 flex items-start justify-between">
                <div className="text-sm font-medium">User Testing</div>
                <Flag className="size-3.5 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-muted-foreground mb-3 text-xs">
                Run usability tests with beta users
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                    <Image
                      alt="User"
                      loading="lazy"
                      width={20}
                      height={20}
                      src="https://avatars.githubusercontent.com/u/124599?v=4"
                    />
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="size-3" />2
                  </span>
                </div>
              </div>
            </div>
            {/* Task 3 */}
            <div className="bg-illustration ring-border-illustration p-3 ring-1">
              <div className="mb-2 flex items-start justify-between">
                <div className="text-sm font-medium">Documentation</div>
                <Flag className="text-muted-foreground size-3.5" />
              </div>
              <p className="text-muted-foreground mb-3 text-xs">
                Write API reference docs
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                    <Image
                      alt="User"
                      loading="lazy"
                      width={20}
                      height={20}
                      src="https://avatars.githubusercontent.com/u/47919550?v=4"
                    />
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-0.5">
                    <Paperclip className="size-3" />1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Integration Logos
const GeminiIcon = () => (
  <svg className="size-6" viewBox="0 0 296 298" fill="none">
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

const VercelIcon = () => (
  <svg viewBox="0 0 256 222" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className="size-6">
    <path fill="currentColor" d="m128 0 128 221.705H0z" />
  </svg>
);

const CursorIcon = () => (
  <svg className="size-6" preserveAspectRatio="xMidYMid" viewBox="0 0 256 257">
    <path fill="#D97757" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
  </svg>
);

const OpenAIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid" viewBox="0 0 256 260" className="size-6">
    <path fill="currentColor" d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
  </svg>
);

const StripeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 214" className="h-6 w-16">
    <path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774" />
  </svg>
);

// Integrations Section
const IntegrationsSection = () => (
  <section>
    {/* Top border */}
    <div className="border-t border-dashed border-border" />

    <div className="px-6 sm:px-8 lg:px-12 py-24">
      <div className="grid grid-cols-4 grid-rows-6 border border-dashed border-border [&>*]:border-dashed md:grid-cols-10 md:grid-rows-3">
        {/* Header Content */}
        <div className="col-span-full row-span-3 space-y-4 p-8 md:col-span-7">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            Connect to every warehouse and BI surface
          </h2>
          <p className="text-muted-foreground text-balance md:text-lg">
            Plug into your existing data stack. From Postgres and Snowflake to dbt and Slack, Folio reads your schema and ships answers where your team already works.
          </p>
        </div>

        {/* Gemini */}
        <div className="col-start-4 flex items-center justify-center border-b border-l max-md:row-start-4 max-md:border-t md:col-start-10">
          <GeminiIcon />
        </div>

        {/* Vercel */}
        <div className="col-start-3 row-start-5 flex items-center justify-center border-l border-t md:col-start-9 md:row-start-2">
          <VercelIcon />
        </div>

        {/* Cursor */}
        <div className="col-start-4 row-start-5 flex items-center justify-center border-l md:col-start-10 md:row-start-2">
          <CursorIcon />
        </div>

        {/* OpenAI */}
        <div className="col-start-2 row-start-6 flex items-center justify-center border-l border-t md:col-start-8 md:row-start-3">
          <OpenAIIcon />
        </div>

        {/* Stripe */}
        <div className="col-start-3 col-end-5 row-start-6 flex items-center justify-center border-l border-t md:col-start-9 md:col-end-11 md:row-start-3">
          <StripeIcon />
        </div>
      </div>
    </div>
  </section>
);

const Services = () => {
  const [expandedCard, setExpandedCard] = useState<'email' | 'task'>('email');

  return (
    <>
    <section>
      {/* Top border */}
      <div className="border-t border-dashed border-border" />

      {/* Header with side padding */}
      <div className="px-6 sm:px-8 lg:px-12 pt-24 pb-12 sm:pb-20">
          <div className="grid items-end gap-6 md:grid-cols-2 lg:gap-12">
            <h2 className="text-foreground text-balance text-4xl font-semibold">
              Automate smarter with AI-powered workflows
            </h2>
            <p className="text-muted-foreground text-balance text-lg">
              From data processing to customer communications, automate any business process with intelligent workflows.
            </p>
          </div>
        </div>

        {/* Cards Grid - Full width, borders touch left/right */}
        <div
          className="grid divide-x divide-dashed divide-border border-y border-dashed border-border transition-[grid-template-columns] duration-300 ease-in-out md:grid-cols-[2fr_1fr]"
          style={{
            gridTemplateColumns:
              expandedCard === 'email' ? '2fr 1fr' : '1fr 2fr',
          }}
        >
          {/* Smart Email Composition Card */}
          <div
            data-slot="card"
            className="text-card-foreground bg-background relative overflow-hidden text-left"
            data-expanded={expandedCard === 'email'}
          >
            <div className="sm:w-162 md:w-158 lg:w-162 grid h-full gap-3 sm:grid-cols-2">
              <div className="flex h-full flex-col justify-between gap-12 py-8 pl-8">
                <LassoSelect className="size-4" />
                <div>
                  <button
                    type="button"
                    className="absolute inset-0 cursor-pointer"
                    aria-label="extend smart email composition feature"
                    aria-expanded={expandedCard === 'email'}
                    onClick={() => setExpandedCard('email')}
                  />
                  <h3 className="text-foreground font-medium">
                    Automated communications
                  </h3>
                  <p className="text-muted-foreground mt-4 text-balance">
                    Draft, personalize, and send emails automatically using AI that understands context and tone.
                  </p>
                </div>
              </div>
              {expandedCard === 'email' && <EmailCompositionContent />}
            </div>
          </div>

          {/* Visual Task Management Card */}
          <div
            data-slot="card"
            className="text-card-foreground bg-background relative overflow-hidden text-left"
            data-expanded={expandedCard === 'task'}
          >
            <div className="sm:w-162 md:w-158 lg:w-162 grid h-full gap-3 [&>*]:h-full sm:grid-cols-2">
              <div className="flex flex-col justify-between gap-12 py-8 pl-8">
                <Brain className="size-4" />
                <div>
                  <button
                    type="button"
                    className="absolute inset-0 cursor-pointer"
                    aria-label="extend visual task management feature"
                    aria-expanded={expandedCard === 'task'}
                    onClick={() => setExpandedCard('task')}
                  />
                  <h3 className="text-foreground font-medium">
                    Visual workflow builder
                  </h3>
                  <p className="text-muted-foreground mt-4 text-balance">
                    Design automations with drag-and-drop. Add conditions, loops, and AI steps without writing code.
                  </p>
                </div>
              </div>
              {expandedCard === 'task' && <TaskManagementContent />}
            </div>
          </div>
        </div>

      {/* Bottom spacing */}
      <div className="py-12" />
    </section>
    <IntegrationsSection />
    </>
  );
};

export default Services;
