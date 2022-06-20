import './Div.style.less'

interface DivProps { }

/**
 * NOTE: this simple div wrapper will be useful when migrate to React Native
 * e.g. replacing Div -> View
 */
const Div: React.FC<DivProps & React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div {...rest}>
    {children}
  </div>
)

export default Div
