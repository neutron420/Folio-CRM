import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Testimonial {
  name: string;
  designation: string;
  title?: string;
  profile?: string;
  content: string;
  mediaUrl?: string;
  thumbnail?: string;
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  if (!testimonial) return null;

  const {
    name = 'Anonymous',
    profile = '',
    designation = 'Customer',
    content = '',
  } = testimonial;

  return (
    <div className='my-4 break-inside-avoid rounded-2xl border border-border bg-background p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'>
      <div className='flex items-center gap-3'>
        <Avatar className='size-10 shrink-0'>
          <AvatarImage src={profile} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className='min-w-0 flex-1'>
          <p className='truncate font-semibold text-foreground text-sm'>
            {name}
          </p>
          <p className='truncate text-muted-foreground text-xs'>
            {designation}
          </p>
        </div>
      </div>

      <p className='mt-3 text-muted-foreground text-sm leading-relaxed'>
        {content}
      </p>
    </div>
  );
}

export default TestimonialCard;
