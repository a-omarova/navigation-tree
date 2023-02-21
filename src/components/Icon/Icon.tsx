import React, { SVGAttributes } from 'react'
import Light from '../../../public/icons/light.svg'
import Dark from '../../../public/icons/dark.svg'
import Home from '../../../public/icons/home.svg'
import Triangle from '../../../public/icons/triangle.svg'
import NavPreload from '../../../public/icons/nav-preload.svg'


const iconsList = {
  'light': Light,
  'dark': Dark,
  'home': Home,
  'triangle': Triangle,
  'navPreload': NavPreload
}

export type IconName = keyof typeof iconsList;

type IconProps = SVGAttributes<HTMLOrSVGElement> & {
  name: IconName
  className?: string
}

export const Icon: React.FC<IconProps> = ({name, className}) => {
  if (!(name in iconsList)) {
    return null
  }

  const Component = iconsList[name]

  return (
    <Component
      className={className}
    />
  )
}
