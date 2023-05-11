import { ResponsiveContainer, AreaChart, XAxis, Area, Tooltip } from 'recharts'
import { numberWithCommas } from '$lib/number-comma'
import type { CumulativeHpaiCase } from '$lib/types'
import { type FC } from 'react'
import { formatDate } from '$lib/format-date'

export type HpaiCaseChartProps = {
  cumulativeCases: CumulativeHpaiCase[]
}

export const HpaiCaseChart: FC<HpaiCaseChartProps> = ({ cumulativeCases }) => (
  <ResponsiveContainer>
    <AreaChart data={cumulativeCases}>
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="hsl(var(--a))" />
          <stop offset="100%" stopColor="hsl(var(--a))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="dateConfirmed"
        tick={{ fill: 'hsl(var(--bc))' }}
        tickLine={{ stroke: 'hsl(var(--bc))', opacity: 0.75 }}
        axisLine={{ opacity: 0 }}
        tickFormatter={formatDate}
      />
      <Area
        type="monotone"
        dataKey="flockSize"
        stroke="hsl(var(--a))"
        fill="url(#chartGradient)"
        strokeWidth={5}
        strokeLinecap="round"
        isAnimationActive={false}
      />
      {/* this should probably be its own component */}
      <Tooltip
        content={(props) =>
          props.payload &&
          props.payload.length > 0 && (
            <div className="rounded-lg bg-base-200 border-0 p-2 flex flex-col shadow">
              <span className="font-bold text-sm text-base-content">
                {formatDate(props.payload[0].payload.dateConfirmed)}
              </span>
              <span className=" text-sm text-base-content">
                Birds Affected:
                <br />
                {numberWithCommas(props.payload[0].payload.flockSize)}
              </span>
            </div>
          )
        }
      />
    </AreaChart>
  </ResponsiveContainer>
)
