import {
    AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, YAxis
  } from 'recharts';
  
  const ScoreGraph = ({ data }: { data: number[] }) => {
    const chartData = data.map((score, i) => ({ score, name: (score).toFixed(1) }));
  
    return (
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <YAxis domain={['auto', 'auto']} tick={{ fill: "#aaa", fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#facc15"
              fill="url(#gradYellow)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#1f1f1f", stroke: "#facc15", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default ScoreGraph;
  