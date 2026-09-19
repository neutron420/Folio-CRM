import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const MAIN_NAV_ITEMS = [
  { label: 'Dashboard', icon: HomeIcon, active: true },
  { label: 'Queries', icon: NotesIcon },
  { label: 'Reports', icon: ReportsIcon },
] as const;

const DATABASE_ITEMS = [
  { label: 'PostgreSQL', icon: DatabaseIcon },
  { label: 'MySQL', icon: DatabaseIcon },
  { label: 'DynamoDB', icon: DatabaseIcon },
] as const;

const CHAT_HISTORY_ITEMS = [
  { label: 'Q4 Revenue Breakdown' },
  { label: 'User Retention Analysis' },
  { label: 'Monthly Active Users' },
  { label: 'Conversion Funnel Report' },
  { label: 'Churn Rate by Segment' },
  { label: 'Pipeline Forecast Model' },
  { label: 'Customer LTV Trends' },
] as const;

// ─── Sidebar Component ──────────────────────────────────────────────────────

export function DashboardSidebar() {
  return (
    <div className='hidden flex-col border-border border-r bg-card pb-3 lg:row-span-2 lg:flex'>
      {/* Search bar */}
      <div className='flex h-12 items-center gap-2 bg-card px-2.5'>
        <SearchInput />
        <SearchButton />
      </div>

      {/* Navigation sections */}
      <div className='flex flex-col gap-3'>
        {/* Main navigation */}
        <NavSection>
          {MAIN_NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={'active' in item && item.active}
            />
          ))}
        </NavSection>

        {/* Connected Databases */}
        <NavSection title='Databases'>
          {DATABASE_ITEMS.map((item) => (
            <NavItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </NavSection>

        {/* Chat History */}
        <NavSection title='Chat History'>
          {CHAT_HISTORY_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              icon={ChatHistoryIcon}
              label={item.label}
            />
          ))}
        </NavSection>
      </div>
    </div>
  );
}

// ─── Primitives ─────────────────────────────────────────────────────────────

function NavSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-px px-2.5'>
      {title && (
        <div className='flex h-7 items-center gap-1.5 overflow-clip pl-2'>
          <ChevronIcon />
          <span className='font-medium text-muted-foreground text-xs tracking-[-0.12px]'>
            {title}
          </span>
        </div>
      )}
      <ul className='flex flex-col gap-px'>{children}</ul>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <li className='flex w-full flex-col'>
      <div
        className={cn(
          'flex h-7 items-center gap-1.5 rounded-lg px-2 text-muted-foreground transition-colors',
          active && 'bg-muted text-foreground',
        )}
      >
        <Icon className='size-3.5 shrink-0' />
        <span className='font-medium text-foreground text-sm tracking-[-0.28px]'>
          {label}
        </span>
      </div>
    </li>
  );
}

function NavGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className='flex w-full flex-col'>
      <div className='flex h-7 items-center gap-1.5 rounded-lg px-2'>
        <Icon className='size-3.5 shrink-0' />
        <span className='font-medium text-foreground text-sm tracking-[-0.28px]'>
          {label}
        </span>
        <ChevronIcon />
      </div>
      <div className='flex flex-col gap-y-px py-px'>{children}</div>
    </li>
  );
}

function NavSubItem({
  icon: Icon,
  label,
  suffix,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  suffix?: string;
}) {
  return (
    <div className='relative flex pl-4'>
      <div className='-translate-y-[2px] absolute left-3.5 h-[29px] w-px bg-border opacity-60' />
      <div className='flex w-full flex-col'>
        <div className='flex h-7 items-center gap-1.5 rounded-lg px-2'>
          <Icon className='size-3.5 shrink-0' />
          <span className='font-medium text-foreground text-sm tracking-[-0.28px]'>
            {label}
          </span>
          {suffix && (
            <span className='font-medium text-muted-foreground text-sm tracking-[-0.28px]'>
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordItem({
  icon: Icon,
  label,
  color,
  dimmed = false,
}: {
  icon: React.FC<{ className?: string; color?: string }>;
  label: string;
  color: string;
  dimmed?: boolean;
}) {
  return (
    <li className={cn('flex w-full flex-col', dimmed && 'opacity-50')}>
      <div className='flex h-7 items-center gap-1.5 rounded-lg px-2'>
        <Icon className='size-3.5 shrink-0' color={color} />
        <span className='font-medium text-foreground text-sm tracking-[-0.28px]'>
          {label}
        </span>
      </div>
    </li>
  );
}

function SearchInput() {
  return (
    <div className='flex h-7 flex-1 items-center justify-between gap-1.5 rounded-lg border border-transparent bg-card pr-1 pl-2 text-muted-foreground shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)] dark:border-border dark:bg-muted/30 dark:shadow-none'>
      <div className='flex flex-1 items-center gap-1.5'>
        <QuickActionsIcon className='size-3.5 shrink-0' />
        <span className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-foreground text-sm tracking-[-0.28px]'>
          Quick Actions
        </span>
      </div>
      <kbd className='flex h-5 min-w-5 items-center justify-center rounded-md border border-border px-1'>
        <span className='text-center font-medium text-[11px] text-muted-foreground'>
          {'\u2318'}K
        </span>
      </kbd>
    </div>
  );
}

function SearchButton() {
  return (
    <div className='flex h-7 w-[53px] items-center justify-between rounded-lg border border-transparent bg-card pr-1 pl-2 text-foreground shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)] dark:border-border dark:bg-muted/30 dark:shadow-none'>
      <SearchIcon className='size-3.5 shrink-0' />
      <kbd className='flex h-5 min-w-5 items-center justify-center rounded-md border border-border px-1'>
        <span className='text-center font-medium text-[11px] text-muted-foreground'>
          /
        </span>
      </kbd>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5 shrink-0 text-muted-foreground'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='m4 5.5 3 3 3-3'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M5.41699 1.14917C6.33787 0.395804 7.66213 0.395804 8.58301 1.14917L11.8994 3.86304C12.5957 4.43275 12.9999 5.28467 13 6.18433V9.99976C13 11.6566 11.6569 12.9998 10 12.9998H4C2.34315 12.9998 1 11.6566 1 9.99976V6.18433C1.0001 5.28467 1.40429 4.43275 2.10059 3.86304L5.41699 1.14917ZM7.9502 1.92261C7.39768 1.47063 6.60232 1.47063 6.0498 1.92261L2.7334 4.63647C2.26924 5.01626 2.0001 5.5846 2 6.18433V9.99976C2 11.1043 2.89543 11.9998 4 11.9998H10C11.1046 11.9998 12 11.1043 12 9.99976V6.18433C11.9999 5.5846 11.7308 5.01626 11.2666 4.63647L7.9502 1.92261ZM9.5 8.99976C9.77607 8.99976 9.99989 9.22371 10 9.49976C10 9.7759 9.77614 9.99976 9.5 9.99976H4.5C4.22386 9.99976 4 9.7759 4 9.49976C4.00011 9.22371 4.22393 8.99976 4.5 8.99976H9.5Z'
        fill='currentColor'
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M8.06958 11.8779C8.20948 11.6399 8.51513 11.5604 8.75317 11.7002C8.99086 11.8402 9.07063 12.1459 8.93091 12.3838C8.86917 12.4888 8.79983 12.5894 8.7229 12.6826C8.31268 13.1797 7.69409 13.4999 7.00024 13.5C6.17538 13.5 5.45986 13.0474 5.06958 12.3838C4.92978 12.1458 5.00931 11.8401 5.24731 11.7002C5.48536 11.5604 5.79101 11.6399 5.93091 11.8779C6.15329 12.2558 6.55245 12.5 7.00024 12.5C7.37803 12.4999 7.71968 12.3267 7.95142 12.0459C7.99473 11.9934 8.03469 11.9372 8.06958 11.8779ZM7.00024 0.5C9.4854 0.500145 11.5002 2.51481 11.5002 5V6.22852C11.5002 7.31935 11.8001 8.38961 12.3674 9.32129C12.8154 10.057 12.2863 10.9996 11.425 11H2.57544C1.71403 10.9998 1.18495 10.0571 1.63306 9.32129C2.20037 8.38964 2.50024 7.3193 2.50024 6.22852V5C2.50025 2.51472 4.51496 0.5 7.00024 0.5ZM7.00024 1.5C5.06725 1.5 3.50025 3.067 3.50024 5V6.22852C3.50024 7.50288 3.14942 8.75338 2.48657 9.8418C2.44461 9.91114 2.49439 9.99977 2.57544 10H11.425C11.5059 9.99957 11.5557 9.91105 11.5139 9.8418C10.851 8.75335 10.5002 7.50293 10.5002 6.22852V5C10.5002 3.06709 8.93312 1.50015 7.00024 1.5Z'
        fill='currentColor'
      />
    </svg>
  );
}

function TasksIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M10.1548 1.00415C11.7397 1.0847 13.0005 2.3953 13.0005 4.00024V10.0002C13.0005 11.6569 11.6571 13 10.0005 13.0002H4.00049C2.39539 13.0002 1.08472 11.7397 1.00439 10.1545L1.00049 10.0002V4.00024C1.00049 2.34339 2.34363 1.00024 4.00049 1.00024H10.0005L10.1548 1.00415ZM4.00049 2.00024C2.89592 2.00024 2.00049 2.89567 2.00049 4.00024V10.0002L2.01123 10.2043C2.11352 11.213 2.96485 12.0002 4.00049 12.0002H10.0005C11.1048 12 12.0005 11.1047 12.0005 10.0002V4.00024C12.0005 2.96476 11.213 2.11347 10.2046 2.01099L10.0005 2.00024H4.00049ZM9.08447 4.7229C9.23766 4.49318 9.54809 4.43106 9.77783 4.58423C10.0072 4.7375 10.0695 5.04798 9.9165 5.27759L7.48584 8.92407C7.01669 9.6278 5.99786 9.67203 5.46924 9.01196L4.10986 7.31274C3.93736 7.09711 3.97236 6.78212 4.18799 6.60962C4.40361 6.43728 4.71866 6.47217 4.89111 6.68774L6.25049 8.38696C6.35631 8.51853 6.56008 8.50998 6.65381 8.36938L9.08447 4.7229Z'
        fill='currentColor'
      />
    </svg>
  );
}

function NotesIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M7.50586 0.499756C7.84892 0.499756 8.10216 0.496957 8.3457 0.55542C8.54966 0.604411 8.74497 0.685086 8.92383 0.794678C9.13728 0.925526 9.31417 1.10689 9.55664 1.34937L11.6504 3.44312C11.8929 3.68558 12.0742 3.86251 12.2051 4.07593C12.3147 4.25475 12.3953 4.45013 12.4443 4.65405C12.5028 4.89756 12.5 5.15091 12.5 5.4939V8.99976C12.5 9.69143 12.5 10.2405 12.4639 10.6824C12.4273 11.1301 12.3509 11.5125 12.1729 11.8621C11.8853 12.4263 11.4265 12.885 10.8623 13.1726C10.5127 13.3507 10.1304 13.427 9.68262 13.4636C9.24066 13.4997 8.69178 13.4998 8 13.4998H6C5.30821 13.4998 4.75933 13.4997 4.31738 13.4636C3.86959 13.427 3.48732 13.3507 3.1377 13.1726C2.57352 12.885 2.1147 12.4263 1.82715 11.8621C1.64909 11.5125 1.57272 11.1302 1.53613 10.6824C1.50004 10.2402 1.5 9.69004 1.5 8.9978V5.00171C1.5 4.30947 1.50003 3.7593 1.53613 3.31714C1.57273 2.86937 1.64906 2.48697 1.82715 2.13745C2.11473 1.57331 2.57353 1.11445 3.1377 0.826904C3.4873 0.648793 3.86962 0.572473 4.31738 0.535889C4.75933 0.499786 5.30823 0.499756 6 0.499756H7.50586ZM6 1.49976C5.2917 1.49976 4.79023 1.49997 4.39844 1.53198C4.01269 1.56352 3.7769 1.62323 3.5918 1.71753C3.2156 1.90923 2.90951 2.21538 2.71777 2.59155C2.62347 2.77664 2.56377 3.01303 2.53223 3.39917C2.50025 3.79115 2.5 4.2932 2.5 5.00171V8.9978C2.5 9.70631 2.50026 10.2083 2.53223 10.6003C2.56376 10.9865 2.6235 11.2229 2.71777 11.408C2.90949 11.7842 3.21559 12.0902 3.5918 12.282C3.7769 12.3763 4.01267 12.436 4.39844 12.4675C4.79023 12.4995 5.29171 12.4998 6 12.4998H8C8.70831 12.4998 9.20977 12.4995 9.60156 12.4675C9.98735 12.436 10.2231 12.3763 10.4082 12.282C10.7844 12.0902 11.0905 11.7842 11.2822 11.408C11.3765 11.2229 11.4362 10.987 11.4678 10.6013C11.4998 10.2096 11.5 9.70795 11.5 8.99976V5.4939C11.5 5.10337 11.4971 4.98914 11.4727 4.88745C11.4482 4.78552 11.4073 4.68777 11.3525 4.59839C11.2979 4.50933 11.2193 4.42606 10.9434 4.15015L8.84961 2.0564C8.57362 1.78041 8.49047 1.70185 8.40137 1.64722C8.31195 1.59243 8.21427 1.55159 8.1123 1.5271C8.01061 1.50269 7.89649 1.49976 7.50586 1.49976H6ZM8 2.49976C8.27608 2.49976 8.49991 2.72369 8.5 2.99976V3.99976C8.5 4.2759 8.72386 4.49976 9 4.49976H10C10.2761 4.49976 10.4999 4.72369 10.5 4.99976C10.5 5.2759 10.2761 5.49976 10 5.49976H9C8.17157 5.49976 7.5 4.82818 7.5 3.99976V2.99976C7.50009 2.72369 7.72392 2.49976 8 2.49976Z'
        fill='currentColor'
      />
    </svg>
  );
}

function EmailsIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M9 1.5C9.69178 1.5 10.2407 1.50003 10.6826 1.53613C11.1304 1.57272 11.5127 1.64901 11.8623 1.82715C12.4265 2.11472 12.8853 2.57347 13.1729 3.1377C13.351 3.48732 13.4273 3.86958 13.4639 4.31738C13.5 4.75934 13.5 5.30822 13.5 6V8C13.5 8.69178 13.5 9.24066 13.4639 9.68262C13.4273 10.1304 13.351 10.5127 13.1729 10.8623C12.8853 11.4265 12.4265 11.8853 11.8623 12.1729C11.5127 12.351 11.1304 12.4273 10.6826 12.4639C10.2407 12.5 9.69178 12.5 9 12.5H5C4.30822 12.5 3.75934 12.5 3.31738 12.4639C2.86958 12.4273 2.48732 12.351 2.1377 12.1729C1.57347 11.8853 1.11472 11.4265 0.827148 10.8623C0.649006 10.5127 0.57272 10.1304 0.536133 9.68262C0.500028 9.24066 0.5 8.69178 0.5 8V6C0.5 5.30822 0.500028 4.75934 0.536133 4.31738C0.57272 3.86958 0.649006 3.48732 0.827148 3.1377C1.11472 2.57347 1.57347 2.11472 2.1377 1.82715C2.48732 1.64901 2.86958 1.57272 3.31738 1.53613C3.75934 1.50003 4.30822 1.5 5 1.5H9ZM10.6504 4.64258C10.8478 4.4495 11.1643 4.45301 11.3574 4.65039C11.5505 4.84779 11.547 5.16432 11.3496 5.35742L10.5977 6.09277C9.82132 6.85226 9.20351 7.4581 8.65625 7.86621C8.09738 8.28296 7.55259 8.54027 6.91602 8.5332C6.27959 8.52603 5.7408 8.25712 5.19141 7.82812C4.65334 7.40797 4.04933 6.78824 3.29004 6.01172L2.64258 5.34961C2.47349 5.17253 2.47523 4.89824 2.64648 4.72302C2.82331 4.55349 3.0876 4.55523 3.25684 4.72648C3.27179 4.74131 3.31494 4.78539 3.35742 4.82849L4.00488 5.4902C4.7839 6.2869 5.3339 6.84858 5.80664 7.21774C6.26796 7.57796 6.59773 7.70724 6.92773 7.7109C7.25766 7.71451 7.5895 7.59197 8.05859 7.24215C8.53941 6.88358 9.10193 6.33485 9.89844 5.55563L10.6504 4.64258Z'
        fill='currentColor'
      />
    </svg>
  );
}

function CallsIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M7 1.5C7.44539 1.5 7.72673 1.49862 7.96973 1.53711C9.25304 1.74056 10.2594 2.74697 10.4629 4.03027C10.4714 4.0841 10.4774 4.1403 10.4824 4.19922L11.1553 3.86328C11.4148 3.73349 11.6403 3.62024 11.8281 3.54688C12.0153 3.47378 12.2363 3.40997 12.4756 3.44531C12.8019 3.49357 13.094 3.67411 13.2832 3.94434C13.4218 4.14253 13.4641 4.36928 13.4824 4.56934C13.5008 4.77004 13.5 5.02245 13.5 5.3125V8.6875C13.5 8.9776 13.5008 9.22994 13.4824 9.43066C13.4641 9.63066 13.4217 9.85653 13.2832 10.0547C13.0941 10.3251 12.8021 10.5064 12.4756 10.5547C12.2363 10.59 12.0153 10.5262 11.8281 10.4531C11.6404 10.3798 11.4148 10.2665 11.1553 10.1367L10.4824 9.7998C10.4774 9.85908 10.4715 9.91561 10.4629 9.96973C10.2594 11.253 9.25305 12.2594 7.96973 12.4629C7.72673 12.5014 7.4454 12.5 7 12.5H5C4.30822 12.5 3.75934 12.5 3.31738 12.4639C2.86958 12.4273 2.48732 12.351 2.1377 12.1729C1.57348 11.8853 1.11472 11.4265 0.827148 10.8623C0.649016 10.5127 0.572719 10.1304 0.536133 9.68262C0.500031 9.24067 0.5 8.69177 0.5 8V6C0.5 5.30823 0.500028 4.75933 0.536133 4.31738C0.572721 3.8696 0.649011 3.48731 0.827148 3.1377C1.11472 2.57348 1.57348 2.11472 2.1377 1.82715C2.48732 1.64901 2.86959 1.57272 3.31738 1.53613C3.75934 1.50003 4.30822 1.5 5 1.5H7Z'
        fill='currentColor'
      />
    </svg>
  );
}

function ReportsIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M8.5 1C9.19178 1 9.74066 1.00003 10.1826 1.03613C10.6304 1.07272 11.0127 1.14901 11.3623 1.32715C11.9265 1.61472 12.3853 2.07347 12.6729 2.6377C12.851 2.98732 12.9273 3.36958 12.9639 3.81738C13 4.25934 13 4.80822 13 5.5V8.5C13 9.19178 13 9.74066 12.9639 10.1826C12.9273 10.6304 12.851 11.0127 12.6729 11.3623C12.3853 11.9265 11.9265 12.3853 11.3623 12.6729C11.0127 12.851 10.6304 12.9273 10.1826 12.9639C9.74066 13 9.19178 13 8.5 13H5.5C4.80822 13 4.25934 13 3.81738 12.9639C3.36958 12.9273 2.98732 12.851 2.6377 12.6729C2.07347 12.3853 1.61472 11.9265 1.32715 11.3623C1.14901 11.0127 1.07272 10.6304 1.03613 10.1826C1.00003 9.74066 1 9.19178 1 8.5V5.5C1 4.80822 1.00003 4.25934 1.03613 3.81738C1.07272 3.36958 1.14901 2.98732 1.32715 2.6377C1.61472 2.07347 2.07347 1.61472 2.6377 1.32715C2.98732 1.14901 3.36958 1.07272 3.81738 1.03613C4.25934 1.00003 4.80822 1 5.5 1H8.5ZM4.5 5C4.22386 5 4 5.22386 4 5.5V9.5C4 9.77614 4.22386 10 4.5 10C4.77614 10 5 9.77614 5 9.5V5.5C5 5.22386 4.77614 5 4.5 5ZM7 3.96191C6.72386 3.96191 6.5 4.18577 6.5 4.46191V9.5C6.50026 9.77592 6.72402 10 7 10C7.27598 10 7.49974 9.77592 7.5 9.5V4.46191C7.5 4.18577 7.27614 3.96191 7 3.96191ZM9.5 7C9.22386 7 9 7.22386 9 7.5V9.5C9 9.77614 9.22386 10 9.5 10C9.77614 10 10 9.77614 10 9.5V7.5C10 7.22386 9.77614 7 9.5 7Z'
        fill='currentColor'
      />
    </svg>
  );
}

function AutomationsIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M3.80469 1.13867C4.18661 1.10126 4.55892 1.2251 4.93945 1.40527C5.32254 1.58669 5.79059 1.86365 6.375 2.20898L10.2578 4.50293C10.8248 4.83799 11.2802 5.10682 11.6152 5.34863C11.9487 5.5893 12.23 5.8495 12.3818 6.19434C12.6078 6.7077 12.6078 7.2923 12.3818 7.80566C12.23 8.15046 11.9487 8.41071 11.6152 8.65137C11.2802 8.89318 10.8248 9.16201 10.2578 9.49707L6.375 11.791C5.79059 12.1363 5.32253 12.4133 4.93945 12.5947C4.55894 12.7749 4.1866 12.8987 3.80469 12.8613C3.23797 12.8057 2.72189 12.5114 2.38574 12.0518C2.15925 11.742 2.07656 11.3587 2.03809 10.9395C1.99936 10.5173 2 9.97299 2 9.29395V4.70605C2 4.02701 1.99937 3.48274 2.03809 3.06055C2.07655 2.64131 2.15927 2.25801 2.38574 1.94824C2.72189 1.48856 3.23795 1.1943 3.80469 1.13867Z'
        fill='currentColor'
      />
    </svg>
  );
}

function SequencesIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <g clipPath='url(#seq-clip)'>
        <path
          d='M0.909424 2.94067C0.263132 1.64598 1.64375 0.276495 2.93286 0.933838L12.2278 5.67407C13.3192 6.23124 13.3181 7.79126 12.2258 8.34692L2.93384 13.0706C1.64391 13.726 0.265383 12.3546 0.91333 11.0608L2.94067 7.01001L0.909424 2.94067ZM3.8147 7.50024L1.80688 11.509C1.591 11.9403 2.05078 12.3974 2.48071 12.179L11.6858 7.50024H3.8147ZM2.47876 1.82544C2.04917 1.60638 1.58895 2.06195 1.80396 2.49341L3.80396 6.50024H11.6477L2.47876 1.82544Z'
          fill='currentColor'
        />
      </g>
      <defs>
        <clipPath id='seq-clip'>
          <rect width='14' height='14' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

function WorkflowsIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <g stroke='currentColor' strokeWidth='1.1' strokeLinecap='round'>
        <rect
          x='1.5'
          y='1.5'
          width='4.5'
          height='4.5'
          rx='1.5'
          strokeLinejoin='round'
        />
        <rect
          x='8'
          y='8'
          width='4.5'
          height='4.5'
          rx='2.25'
          strokeLinejoin='round'
        />
        <path d='M2.5 8v1A2.5 2.5 0 0 0 5 11.5h1M11.5 6V5A2.5 2.5 0 0 0 9 2.5H8' />
      </g>
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M4.33691 1.00049C4.55752 1.00049 4.74968 0.996967 4.93555 1.0415C5.0884 1.07821 5.23508 1.1391 5.36914 1.22119C5.53217 1.32114 5.6662 1.45966 5.82227 1.61572L6.88477 2.67822C7.07437 2.86783 7.11461 2.90353 7.15332 2.92725C7.19789 2.95447 7.24707 2.97462 7.29785 2.98682C7.34192 2.99733 7.3956 3.00049 7.66309 3.00049H10.5C11.7371 3.00048 12.7616 3.89952 12.9619 5.07959C13.0685 5.10849 13.1731 5.14938 13.2734 5.2085C13.5822 5.3905 13.8159 5.67687 13.9316 6.01611C14.0104 6.24727 14.0081 6.48066 13.9814 6.7085C13.9552 6.93225 13.8983 7.20544 13.832 7.52588L13.6494 8.41162C13.5335 8.97265 13.4413 9.42063 13.3389 9.77979C13.2347 10.1449 13.1106 10.4529 12.916 10.729C12.5991 11.1784 12.1644 11.5322 11.6602 11.7515C11.3502 11.8862 11.0234 11.9451 10.6445 11.9731C10.272 12.0007 9.81517 12.0005 9.24219 12.0005H3C1.61942 12.0005 0.500219 10.881 0.5 9.50049V4.70068C0.5 4.14909 0.500032 3.70471 0.529297 3.34619C0.559055 2.98198 0.621753 2.66172 0.772461 2.36572C1.01212 1.89537 1.3949 1.51264 1.86523 1.27295C2.16132 1.12213 2.48137 1.05956 2.8457 1.02979C3.20429 1.00049 3.64839 1.00049 4.2002 1.00049H4.33691Z'
        fill='currentColor'
      />
    </svg>
  );
}

function SimpleFolderIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M4.58594 1C4.98369 1.00004 5.36522 1.1582 5.64648 1.43945L7.06055 2.85352C7.15427 2.94724 7.28152 2.99995 7.41406 3H10.5C12.1568 3 13.5 4.34316 13.5 6V9.5C13.5 11.1569 12.1569 12.5 10.5 12.5H3.5C1.84316 12.5 0.5 11.1568 0.5 9.5V4C0.500016 2.34317 1.84317 1.00002 3.5 1H4.58594ZM3.5 2C2.39545 2.00002 1.50002 2.89545 1.5 4V9.5C1.5 10.6046 2.39544 11.5 3.5 11.5H10.5C11.6046 11.5 12.5 10.6046 12.5 9.5V6C12.5 4.89544 11.6046 4 10.5 4H7.41406C7.0163 3.99995 6.63478 3.84181 6.35352 3.56055L4.93945 2.14648C4.84572 2.05277 4.71848 2.00004 4.58594 2H3.5Z'
        fill='currentColor'
      />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <rect
        x='1.75'
        y='1.75'
        width='4.2'
        height='5.5'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect
        x='1.75'
        y='9.25'
        width='4.2'
        height='3'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect
        x='8.05'
        y='1.65'
        width='4.2'
        height='3'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect
        x='8.05'
        y='6.75'
        width='4.2'
        height='5.5'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function PeopleIcon({
  className,
  color,
}: { className?: string; color?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 5.6c0-1.96 0-2.94.381-3.689a3.5 3.5 0 0 1 1.53-1.53C2.66 0 3.64 0 5.6 0h2.8c1.96 0 2.94 0 3.689.381a3.5 3.5 0 0 1 1.53 1.53C14 2.66 14 3.64 14 5.6v2.8c0 1.96 0 2.94-.382 3.689a3.5 3.5 0 0 1-1.529 1.53C11.34 14 10.36 14 8.4 14H5.6c-1.96 0-2.94 0-3.689-.382a3.5 3.5 0 0 1-1.53-1.529C0 11.34 0 10.36 0 8.4V5.6Zm4.308 5.708h5.384c.595 0 1.077-.482 1.077-1.077a2.585 2.585 0 0 0-2.584-2.585h-2.37a2.585 2.585 0 0 0-2.584 2.585c0 .595.482 1.077 1.077 1.077ZM7 6.618a1.963 1.963 0 1 0 0-3.926 1.963 1.963 0 0 0 0 3.926Z'
        fill={color || '#17BDE9'}
      />
    </svg>
  );
}

function CompaniesIcon({
  className,
  color,
}: { className?: string; color?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M.381 1.911C0 2.66 0 3.64 0 5.6v2.8c0 1.96 0 2.94.381 3.689a3.5 3.5 0 0 0 1.53 1.53C2.66 14 3.64 14 5.6 14h2.8c1.96 0 2.94 0 3.689-.382a3.5 3.5 0 0 0 1.53-1.529C14 11.34 14 10.36 14 8.4V5.6c0-1.96 0-2.94-.382-3.689A3.5 3.5 0 0 0 12.09.381C11.34 0 10.36 0 8.4 0H5.6C3.64 0 2.66 0 1.911.381a3.5 3.5 0 0 0-1.53 1.53Zm2.85 4.228V7.86c0 1.207 0 1.81.235 2.27.206.406.536.735.94.942.308.156.678.209 1.248.226V10.5c0-.452 0-.678.083-.853a.862.862 0 0 1 .41-.41c.175-.083.4-.083.853-.083.452 0 .678 0 .853.083.18.085.325.23.41.41.083.175.083.4.083.853v.799c.57-.017.94-.07 1.247-.226.405-.207.735-.536.941-.941.235-.461.235-1.064.235-2.27V6.138c0-1.206 0-1.809-.235-2.27a2.154 2.154 0 0 0-.94-.94c-.462-.236-1.065-.236-2.27-.236h-.647c-1.206 0-1.81 0-2.27.235a2.154 2.154 0 0 0-.941.941c-.235.461-.235 1.064-.235 2.27Zm1.137-1.436c0-.298.24-.539.538-.539h2.848a.538.538 0 0 1 0 1.077H4.906a.538.538 0 0 1-.538-.538Zm1.878 1.472a.538.538 0 1 0 0 1.077h2.848a.538.538 0 1 0 0-1.077H6.246Z'
        fill={color || '#266DF0'}
      />
    </svg>
  );
}

function QuickActionsIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M8.5 0.499756C9.19178 0.499756 9.74066 0.499784 10.1826 0.535889C10.6304 0.572475 11.0127 0.648762 11.3623 0.826904C11.9265 1.11448 12.3853 1.57323 12.6729 2.13745C12.851 2.48707 12.9273 2.86934 12.9639 3.31714C13 3.75909 13 4.30797 13 4.99976V8.99976C13 9.69154 13 10.2404 12.9639 10.6824C12.9273 11.1302 12.851 11.5124 12.6729 11.8621C12.3853 12.4263 11.9265 12.885 11.3623 13.1726C11.0127 13.3507 10.6304 13.427 10.1826 13.4636C9.74066 13.4997 9.19178 13.4998 8.5 13.4998H5.5C4.80822 13.4998 4.25934 13.4997 3.81738 13.4636C3.36958 13.427 2.98732 13.3507 2.6377 13.1726C2.07347 12.885 1.61472 12.4263 1.32715 11.8621C1.14901 11.5125 1.07272 11.1302 1.03613 10.6824C1.00003 10.2404 1 9.69154 1 8.99976V4.99976C1 4.30797 1.00003 3.75909 1.03613 3.31714C1.07272 2.86934 1.14901 2.48707 1.32715 2.13745C1.61472 1.57323 2.07347 1.11448 2.6377 0.826904C2.98732 0.648762 3.36958 0.572475 3.81738 0.535889C4.25934 0.499784 4.80822 0.499756 5.5 0.499756H8.5ZM5.5 1.49976C4.79168 1.49976 4.29023 1.49997 3.89844 1.53198C3.51264 1.56352 3.27691 1.62321 3.0918 1.71753C2.71554 1.90926 2.40951 2.2153 2.21777 2.59155C2.12345 2.77667 2.06377 3.01239 2.03223 3.39819C2.00022 3.78999 2 4.29144 2 4.99976V8.99976C2 9.70807 2.00022 10.2095 2.03223 10.6013C2.06377 10.9871 2.12345 11.2229 2.21777 11.408C2.40951 11.7842 2.71554 12.0903 3.0918 12.282C3.27691 12.3763 3.51264 12.436 3.89844 12.4675C4.29023 12.4995 4.79168 12.4998 5.5 12.4998H8.5C9.20832 12.4998 9.70977 12.4995 10.1016 12.4675C10.4874 12.436 10.7231 12.3763 10.9082 12.282C11.2845 12.0903 11.5905 11.7842 11.7822 11.408C11.8765 11.2229 11.9362 10.9871 11.9678 10.6013C11.9998 10.2095 12 9.70807 12 8.99976V4.99976C12 4.29144 11.9998 3.78999 11.9678 3.39819C11.9362 3.01239 11.8765 2.77667 11.7822 2.59155C11.5905 2.2153 11.2845 1.90926 10.9082 1.71753C10.7231 1.62321 10.4874 1.56352 10.1016 1.53198C9.70977 1.49997 9.20832 1.49976 8.5 1.49976H5.5ZM5.5 2.99976C5.77614 2.99976 6 3.22361 6 3.49976V5.49097L6.19629 5.29175L8.12988 3.16382C8.31553 2.95953 8.63157 2.94414 8.83594 3.12964C9.04022 3.31529 9.05562 3.63133 8.87012 3.83569L7.21973 5.6521L9.37988 8.17456C9.55036 8.46095 9.50872 8.72243 9.3252 8.87964C9.11547 9.05917 8.79973 9.03463 8.62012 8.82495L6.52734 6.38062L6 6.91772V8.49976C6 8.7759 5.77614 8.99976 5.5 8.99976C5.22386 8.99976 5 8.7759 5 8.49976V3.49976C5 3.22361 5.22386 2.99976 5.5 2.99976Z'
        fill='currentColor'
      />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <ellipse
        cx='7'
        cy='3.5'
        rx='5'
        ry='2'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M2 3.5v3.25C2 8.05 4.24 9.25 7 9.25s5-1.2 5-2.5V3.5'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
      <path
        d='M2 6.75V10c0 1.3 2.24 2.5 5 2.5s5-1.2 5-2.5V6.75'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function ChatHistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M4.5 5.25h5M4.5 7.75h3'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
      <path
        d='M1.5 7c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.23.545C5.3 0 6.7 0 9.5 0h.5c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C14 2.605 14 3.07 14 4v3c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C10.2 15 8.8 15 6 15H5.5c-.93 0-1.395 0-1.776-.102a3 3 0 0 1-2.122-2.122C1.5 12.395 1.5 11.93 1.5 11V7Z'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
        transform='scale(0.93) translate(0.5, 0.5)'
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M12.1797 12.313 9.467 9.467M1.313 6.054a4.741 4.741 0 1 1 9.482 0 4.741 4.741 0 0 1-9.482 0Z'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
