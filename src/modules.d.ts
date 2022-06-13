declare module '*.css' {
  const resource: { [key: string]: string }
  export = resource
}

declare module '*.less' {
  const resource: { [key: string]: string }
  export = resource
}

declare module '*.svg' {
  const content: any
  export default content
}

interface SlideRoutesProps {
  animation?: 'slide' | 'vertical-slide' | 'rotate'   // Default: 'slide'
  pathList?: string[]                                 // Default: []
  duration?: number                                   // Default: 200
  timing?: 'ease' | 'ease-in' | 'ease-out'            // Default: 'ease'
      | 'ease-in-out' | 'linear'
  destroy?: boolean                                   // Default: true
  children: JSX.Element[]
}

declare module 'react-slide-routes' {
  const SlideRoutes: React.FC<SlideRoutesProps>
  export default SlideRoutes
}
