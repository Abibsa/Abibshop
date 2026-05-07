export const ROBUX_TARGETS = [
  { robux: 800, points: 13000 },
  { robux: 1000, points: 16250 },
] as const

export type Account = {
  id: string
  name: string
  currentPoints: number
  dailyPoints: number
}

export type CalcResult = {
  targetRobux: number
  targetPoints: number
  daysNeeded: number
  estimatedDate: Date
  percentage: number
  isReady: boolean
}

export function calculate(
  account: Account,
  target: typeof ROBUX_TARGETS[number]
): CalcResult {
  const pointsNeeded = target.points - account.currentPoints
  const daysNeeded = pointsNeeded > 0 
    ? Math.ceil(pointsNeeded / account.dailyPoints) 
    : 0
  
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + daysNeeded)
  
  const percentage = Math.min(
    Math.round((account.currentPoints / target.points) * 100),
    100
  )
  
  const isReady = account.currentPoints >= target.points

  return {
    targetRobux: target.robux,
    targetPoints: target.points,
    daysNeeded,
    estimatedDate,
    percentage,
    isReady,
  }
}
