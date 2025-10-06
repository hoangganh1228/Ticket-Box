import { tv } from 'tailwind-variants';

export const ticketTitle = tv({
  base: 'whitespace-nowrap break-all overflow-hidden text-ellipsis line-clamp-1 font-normal leading-[21px] text-sm',
  variants: {
    size: {
      small: 'w-[180px]',
      medium: 'w-[220px]',
      large: 'w-[260px]',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const TagStatus = tv({
  base: "flex items-center justify-center p-1 flex-grow basis-0 not-italic font-bold text-sm leading-[21px] rounded-[18px] min-w-[100px] bg-[rgb(175,184,201)] opacity-40 text-[rgb(42,45,52)] cursor-pointer transition-colors duration-200",
  variants: {
    active: {
      true: "bg-primary text-black opacity-100", // Khi active
      false: "",
    },
  },
  defaultVariants: {
    active: false,
  },
});