"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--blanc);
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(251, 248, 243, 0.15);
  background: rgba(251, 248, 243, 0.05);
  color: var(--blanc) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba(251, 248, 243, 0.25);
    background: rgba(251, 248, 243, 0.08);
  }

  &:focus {
    outline: none;
    border-color: var(--rose);
    background: rgba(251, 248, 243, 0.1);
  }

  option {
    background: var(--noir);
    color: var(--blanc) !important;
  }
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid rgba(251, 248, 243, 0.1);
  background: rgba(251, 248, 243, 0.03);
  gap: 4px;
`;

const ToggleButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 999px;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  background: ${(props) => (props.$active ? "var(--rose)" : "transparent")};
  color: ${(props) => (props.$active ? "var(--blanc)" : "rgba(251, 248, 243, 0.7)")} !important;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

const SummaryCard = styled.div`
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(251, 248, 243, 0.08);
  background: linear-gradient(145deg, rgba(251, 248, 243, 0.04), rgba(251, 248, 243, 0.02));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
`;

const CardLabel = styled.div`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(251, 248, 243, 0.55) !important;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--blanc) !important;
`;

const CardHint = styled.div`
  font-size: 12px;
  color: rgba(251, 248, 243, 0.6) !important;
  margin-top: 6px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(251, 248, 243, 0.08);
  background: rgba(251, 248, 243, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--blanc) !important;
`;

const EmptyState = styled.div`
  padding: 20px;
  border-radius: 14px;
  text-align: center;
  color: rgba(251, 248, 243, 0.6) !important;
  background: rgba(251, 248, 243, 0.03);
  font-family: var(--font-manrope), "Manrope", sans-serif;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const LegendBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(251, 248, 243, 0.7) !important;
  font-size: 13px;
  font-family: var(--font-manrope), "Manrope", sans-serif;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 999px;
  background: ${(props) => props.$color};
`;

const ClientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ClientRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(251, 248, 243, 0.03);
  border: 1px solid rgba(251, 248, 243, 0.05);
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ClientName = styled.span`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--blanc) !important;
`;

const ClientMeta = styled.span`
  font-size: 12px;
  color: rgba(251, 248, 243, 0.6) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
`;

const ClientValue = styled.span`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--rose) !important;
  white-space: nowrap;
`;

const LoadingMessage = styled.div`
  padding: 16px 0;
  color: rgba(251, 248, 243, 0.65) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(178, 59, 59, 0.12);
  color: #ed96a6 !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
  border: 1px solid rgba(178, 59, 59, 0.3);
`;

const formatAmount = (value) =>
  `${Number(value || 0).toLocaleString("fr-FR")} DA`;

const formatYAxisValue = (value) => {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000) {
    return `${Math.round(number / 1000)}k`;
  }
  return number.toString();
};

const periodLabels = {
  day: "Aujourd'hui",
  week: "Cette semaine",
  month: "Ce mois",
  year: "Cette année",
};

const dayLabels = Array.from({ length: 24 }, (_, index) => `${index.toString().padStart(2, "0")}h`);
const weekLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function parseBillDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPeriodRange(period) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case "day":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "week": {
      const day = start.getDay();
      const diffToMonday = (day + 6) % 7;
      start.setDate(start.getDate() - diffToMonday);
      start.setHours(0, 0, 0, 0);
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setDate(new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate());
      end.setHours(23, 59, 59, 999);
      break;
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
  }

  return [start, end];
}

function getAxisLabels(period) {
  switch (period) {
    case "day":
      return dayLabels;
    case "week":
      return weekLabels;
    case "month": {
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, index) => `${index + 1}`);
    }
    case "year":
      return monthNames;
    default:
      return monthNames;
  }
}

function getChartBucket(date, period) {
  switch (period) {
    case "day":
      return date.getHours();
    case "week":
      return (date.getDay() + 6) % 7;
    case "month":
      return date.getDate() - 1;
    case "year":
      return date.getMonth();
    default:
      return 0;
  }
}

function buildChartData(period, bills) {
  const labels = getAxisLabels(period);
  const buckets = labels.map(() => ({ revenue: 0, unpaid: 0 }));
  const [start, end] = getPeriodRange(period);

  bills.forEach((bill) => {
    const date = parseBillDate(bill.createdAt);
    if (!date || date < start || date > end) return;

    const bucketKey = getChartBucket(date, period);
    if (bucketKey < 0 || bucketKey >= buckets.length) return;

    const amount = Number(bill.totalAmount || 0);
    const isPaid = bill.isPaid === true || bill.status === "paid";

    if (isPaid) {
      buckets[bucketKey].revenue += amount;
    } else {
      buckets[bucketKey].unpaid += amount;
    }
  });

  return labels.map((name, index) => ({
    name,
    revenue: buckets[index].revenue,
    unpaid: buckets[index].unpaid,
  }));
}

export default function StatsTab({ bills }) {
  const [period, setPeriod] = useState("month");
  const [chartMode, setChartMode] = useState("revenue");
  const [rankingMode, setRankingMode] = useState("recurrence");

  const filteredBills = useMemo(() => {
    if (!Array.isArray(bills)) return [];

    const [start, end] = getPeriodRange(period);

    return bills.filter((bill) => {
      const date = parseBillDate(bill.createdAt);
      return date && date >= start && date <= end;
    });
  }, [bills, period]);

  const stats = useMemo(() => {
    return filteredBills.reduce(
      (acc, bill) => {
        const amount = Number(bill.totalAmount || 0);
        const isPaid = bill.isPaid === true || bill.status === "paid";
        const paymentMethod = String(bill.paymentMethod || "").toLowerCase();

        if (isPaid) {
          acc.totalRevenue += amount;
          if (paymentMethod.includes("esp")) {
            acc.cashRevenue += amount;
          }
          if (paymentMethod.includes("carte")) {
            acc.cardRevenue += amount;
          }
        } else {
          acc.totalUnpaid += amount;
        }

        acc.countBills += 1;
        return acc;
      },
      {
        totalRevenue: 0,
        totalUnpaid: 0,
        countBills: 0,
        cashRevenue: 0,
        cardRevenue: 0,
      },
    );
  }, [filteredBills]);

  const chartData = useMemo(() => buildChartData(period, filteredBills), [period, filteredBills]);

  const computedTopClients = useMemo(() => {
    const merged = new Map();

    (filteredBills || []).forEach((bill) => {
      const name = bill.clientName?.trim();
      if (!name) return;

      const current = merged.get(name) || {
        name,
        recurrence: 0,
        profitability: 0,
      };

      current.recurrence += 1;
      current.profitability += Number(bill.totalAmount || 0);
      merged.set(name, current);
    });

    return Array.from(merged.values())
      .sort((a, b) => {
        if (rankingMode === "profit") {
          return b.profitability - a.profitability;
        }
        return b.recurrence - a.recurrence;
      })
      .slice(0, 5);
  }, [filteredBills, rankingMode]);

  // Configuration dynamique des couleurs du graphique Recharts
  const chartColor = chartMode === "revenue" ? "#ed64a6" : "#f1b36a";
  const dataKey = chartMode === "revenue" ? "revenue" : "unpaid";

  return (
    <StatsContainer>
      <Header>
        <Title>Statistiques financières</Title>
        <HeaderMeta>
          <ToggleGroup>
            <ToggleButton
              $active={chartMode === "revenue"}
              onClick={() => setChartMode("revenue")}
            >
              Revenus
            </ToggleButton>
            <ToggleButton
              $active={chartMode === "unpaid"}
              onClick={() => setChartMode("unpaid")}
            >
              Sommes dues
            </ToggleButton>
          </ToggleGroup>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="day">Jour</option>
            <option value="week">Semaine</option>
            <option value="month">Mois</option>
            <option value="year">Année</option>
          </Select>
        </HeaderMeta>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <CardLabel>Revenu total</CardLabel>
          <CardValue>{formatAmount(stats.totalRevenue)}</CardValue>
          <CardHint>{periodLabels[period]} • {stats.countBills || 0} factures</CardHint>
        </SummaryCard>
            <SummaryCard>
              <CardLabel>Sommes dues</CardLabel>
              <CardValue>{formatAmount(stats.totalUnpaid)}</CardValue>
              <CardHint>À suivre rapidement</CardHint>
            </SummaryCard>
            <SummaryCard>
              <CardLabel>Espèces</CardLabel>
              <CardValue>{formatAmount(stats.cashRevenue)}</CardValue>
              <CardHint>Revenus encaissés en cash</CardHint>
            </SummaryCard>
            <SummaryCard>
              <CardLabel>Carte</CardLabel>
              <CardValue>{formatAmount(stats.cardRevenue)}</CardValue>
              <CardHint>Revenus par carte</CardHint>
            </SummaryCard>
          </SummaryGrid>

          <Grid>
            <Panel>
              <PanelTitle>Évolution {chartMode === "revenue" ? "des revenus" : "des sommes dues"}</PanelTitle>
              <ChartWrapper style={{ height: 250, width: "100%", marginTop: 20 }}>
                {chartData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={chartColor} stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,248,243,0.08)" />
                      <XAxis dataKey="name" stroke="rgba(251,248,243,0.4)" fontSize={12} />
                      <YAxis stroke="rgba(251,248,243,0.4)" fontSize={12} tickFormatter={formatYAxisValue} />
                      <Tooltip 
                        formatter={(value) => [formatAmount(value), chartMode === "revenue" ? "Revenu" : "Somme due"]}
                        contentStyle={{ backgroundColor: "#1a202c", borderColor: "rgba(251,248,243,0.16)", borderRadius: 8 }}
                        labelStyle={{ color: "rgba(251,248,243,0.6)" }}
                      />
                      <Area type="monotone" dataKey={dataKey} stroke={chartColor} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState>Aucune donnée à afficher pour le moment.</EmptyState>
                )}
              </ChartWrapper>
            </Panel>

            <Panel>
              <PanelTitle>Top 5 clients</PanelTitle>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ToggleGroup>
                  <ToggleButton
                    $active={rankingMode === "recurrence"}
                    onClick={() => setRankingMode("recurrence")}
                  >
                    Fréquence
                  </ToggleButton>
                  <ToggleButton
                    $active={rankingMode === "profit"}
                    onClick={() => setRankingMode("profit")}
                  >
                    Rentabilité
                  </ToggleButton>
                </ToggleGroup>
              </div>

              {computedTopClients.length ? (
                <ClientsList>
                  {computedTopClients.map((client, index) => (
                    <ClientRow key={`${client.name}-${index}`}>
                      <ClientInfo>
                        <ClientName>
                          #{index + 1} {client.name}
                        </ClientName>
                        <ClientMeta>
                          {rankingMode === "profit"
                            ? `${client.recurrence} visites`
                            : `${client.recurrence} visite${client.recurrence > 1 ? "s" : ""}`}
                        </ClientMeta>
                      </ClientInfo>
                      <ClientValue>
                        {rankingMode === "profit"
                          ? formatAmount(client.profitability)
                          : `${client.recurrence} visite${client.recurrence > 1 ? "s" : ""}`}
                      </ClientValue>
                    </ClientRow>
                  ))}
                </ClientsList>
              ) : (
                <EmptyState>Aucun client à afficher pour le moment.</EmptyState>
              )}
            </Panel>
          </Grid>
    </StatsContainer>
  );
}