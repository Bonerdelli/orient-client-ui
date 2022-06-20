/**
 * Compose class name from conditional class map
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */
export const composeClasses = (classConditionsMap: Record<string, boolean>) =>
  Object.entries(classConditionsMap)
    .filter(([_, condition]) => condition)
    .map(([className]) => className)
    .join(' ')
