import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'

export const Button: FC<DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = ({ onClick, title, className, ...rest }) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`px-5 py-2 rounded-sm border border-gray-300 bg-white hover:bg-gray-100 ${className}`}
    >
      {title}
    </button>
  )
}
