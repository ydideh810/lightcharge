import { Icon, IconProps } from '@chakra-ui/react'

import { useCustomTheme } from '../../../utils'

export const MilestoneIcon = (props: IconProps) => {
  const { colors } = useCustomTheme()
  return (
    <Icon
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="9"
        cy="9"
        r="7.33333"
        stroke={colors.neutral[200]}
        strokeWidth="3.33333"
      />
      <mask id="path-2-inside-1_8326_146769" fill={colors.neutral[0]}>
        <path d="M9 16.346C9 17.2595 9.74669 18.0154 10.6448 17.8485C12.4202 17.5184 14.0691 16.6589 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C14.0691 1.34114 12.4202 0.481568 10.6448 0.151533C9.74669 -0.0154153 9 0.740521 9 1.654C9 2.56748 9.7557 3.28488 10.6309 3.54663C11.5269 3.81462 12.3515 4.30183 13.0249 4.97515C14.0923 6.04261 14.692 7.49039 14.692 9C14.692 10.5096 14.0923 11.9574 13.0248 13.0248C12.3515 13.6982 11.5269 14.1854 10.6309 14.4534C9.75569 14.7151 9 15.4325 9 16.346Z" />
      </mask>
      <path
        d="M9 16.346C9 17.2595 9.74669 18.0154 10.6448 17.8485C12.4202 17.5184 14.0691 16.6589 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C14.0691 1.34114 12.4202 0.481568 10.6448 0.151533C9.74669 -0.0154153 9 0.740521 9 1.654C9 2.56748 9.7557 3.28488 10.6309 3.54663C11.5269 3.81462 12.3515 4.30183 13.0249 4.97515C14.0923 6.04261 14.692 7.49039 14.692 9C14.692 10.5096 14.0923 11.9574 13.0248 13.0248C12.3515 13.6982 11.5269 14.1854 10.6309 14.4534C9.75569 14.7151 9 15.4325 9 16.346Z"
        stroke="currentColor"
        strokeWidth="6.66667"
        mask="url(#path-2-inside-1_8326_146769)"
      />
    </Icon>
  )
}
