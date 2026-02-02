import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingCart, Inventory, AttachMoney } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ totalSales: 0, totalPurchases: 0, totalProducts: 0 });

  useEffect(() => {
    // Using dummy data for now since backend has connection issues
    const dummyData = {
      totalSales: 2750000,
      totalPurchases: 1800000,
      totalProducts: 20
    };
    setMetrics(dummyData);
  }, []);

  const data = [
    { name: 'Sales', value: metrics.totalSales },
    { name: 'Purchases', value: metrics.totalPurchases }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mr: 2,
                  width: 48,
                  height: 48
                }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Sales</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    Rp {metrics.totalSales.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <TrendingUp sx={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.3, fontSize: 40 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mr: 2,
                  width: 48,
                  height: 48
                }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Purchases</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    Rp {metrics.totalPurchases.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <ShoppingCart sx={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.3, fontSize: 40 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mr: 2,
                  width: 48,
                  height: 48
                }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Products</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    {metrics.totalProducts}
                  </Typography>
                </Box>
              </Box>
              <Inventory sx={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.3, fontSize: 40 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mr: 2,
                  width: 48,
                  height: 48
                }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Net Profit</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    Rp {(metrics.totalSales - metrics.totalPurchases).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <TrendingUp sx={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.3, fontSize: 40 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                Sales vs Purchases Overview
              </Typography>
              <Box sx={{ height: 400, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={(value) => `Rp ${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [`Rp ${value.toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#1976d2"
                      radius={[4, 4, 0, 0]}
                      name="Amount"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;