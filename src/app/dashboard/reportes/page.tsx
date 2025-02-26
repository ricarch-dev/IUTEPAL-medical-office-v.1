'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/src/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/src/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { getInitialChartData } from '@/src/lib/utils';
import {
  chartConfigConsult,
  chartConfigEvents,
  chartConfigPathology,
  chartConfigPatient,
  chartConfigRecipe,
} from '@/src/lib/charts-config';

function ChartCard({ title, config, data }: { title: string; config: ChartConfig; data: any }) {
  return (
    <Card className="p-3">
      <h2 className="text-center">{title}</h2>
      <ChartContainer config={config} className="min-h-[200px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 50,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
          </Bar>
          {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}>
            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
          </Bar> */}
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

async function fetchData(endpoint: string) {
  const response = await fetch(endpoint);
  const result = await response.json();
  const data = result.data;

  const transformedData = getInitialChartData();
  data.forEach((item: any) => {
    const month = new Date(item.created_at).toLocaleString('es-ES', { month: 'long' });
    const existingMonth = transformedData.find((dataItem) => dataItem.month === month);

    if (existingMonth) {
      existingMonth.desktop += 1;
    }
  });

  return transformedData;
}

export default function Page() {
  const [chartData, setChartData] = useState({
    patients: getInitialChartData(),
    consults: getInitialChartData(),
    events: getInitialChartData(),
    recipes: getInitialChartData(),
    pathologies: getInitialChartData(),
  });

  useEffect(() => {
    async function fetchAllData() {
      const [patients, consults, events, recipes, pathologies] = await Promise.all([
        fetchData('/api/reportes/pacientes'),
        fetchData('/api/reportes/consultas'),
        fetchData('/api/reportes/citas'),
        fetchData('/api/reportes/reposos'),
        fetchData('/api/reportes/patologias'),
      ]);

      setChartData({ patients, consults, events, recipes, pathologies });
    }

    fetchAllData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5">
      <ChartCard
        title="¿Cuantos pacientes se registraron en el año?"
        config={chartConfigPatient}
        data={chartData.patients}
      />
      <ChartCard
        title="¿Cuantas consultas se registraron en el año?"
        config={chartConfigConsult}
        data={chartData.consults}
      />
      <ChartCard title="¿Cuantas citas se registraron en el año?" config={chartConfigEvents} data={chartData.events} />
      <ChartCard
        title="¿Cuantos reposos se registraron en el año?"
        config={chartConfigRecipe}
        data={chartData.recipes}
      />
      <ChartCard
        title="¿Cuantas patologias se registraron en el año?"
        config={chartConfigPathology}
        data={chartData.pathologies}
      />
    </div>
  );
}
