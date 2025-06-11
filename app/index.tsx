import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LineChart from '../components/LineChart';
import { useMarketData } from '../hooks/useMarketData';

type VisibleKeys = 'open' | 'close' | 'low' | 'high';

const LINE_CONFIG: { key: VisibleKeys; label: string; color: string }[] = [
  { key: 'open', label: 'Open', color: '#1976D2' },
  { key: 'close', label: 'Close', color: '#E91E63' },
  { key: 'low', label: 'Low', color: '#00BFAE' },
  { key: 'high', label: 'High', color: '#FFA000' },
];

const Page = () => {
  const { data: marketData, loading, error } = useMarketData('AAPL');
  const [visible, setVisible] = useState<Record<VisibleKeys, boolean>>({ open: true, close: true, low: false, high: false });
  const [zoomDomain, setZoomDomain] = useState<{ x: number, y: number }>();
  const [showAllXAxis, setShowAllXAxis] = useState(false);

  const handleCheckbox = (key: VisibleKeys) => {
    setVisible(v => ({ ...v, [key]: !v[key] }));
  };

  const handleResetZoom = () => {
    setZoomDomain({ x: 0, y: 0 });
    setShowAllXAxis(false);
  };

  const handleZoomDomainChange = (domain: any) => {
    setZoomDomain(domain);
    if (domain && domain.x && marketData.length > 0) {
      const totalDates = marketData.length;
      const domainRange = domain.x[1] - domain.x[0];
      setShowAllXAxis(domainRange < totalDates - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AAPL Market Data</Text>
      </View>
      <View style={styles.chartContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <LineChart
            marketData={marketData}
            lineConfig={LINE_CONFIG}
            visible={visible}
            zoomDomain={zoomDomain}
            showAllXAxis={showAllXAxis}
            onZoomDomainChange={handleZoomDomainChange}
          />
        )}
      </View>
      <View style={styles.resetZoomContainer}>
        <TouchableOpacity onPress={handleResetZoom} style={styles.resetZoomButton}>
          <Text style={styles.resetZoomText}>Reset Zoom</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.displayContainer}>
        <Text style={styles.displayTitle}>Display</Text>
        {LINE_CONFIG.map(l => (
          <TouchableOpacity key={l.key} onPress={() => handleCheckbox(l.key as VisibleKeys)} style={styles.checkboxRow}>
            <View style={[
              styles.checkbox,
              { borderColor: l.color, backgroundColor: visible[l.key as VisibleKeys] ? l.color : '#fff' }
            ]}>
              {visible[l.key as VisibleKeys] && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#f2f4f8',
    borderRadius: 20,
    margin: 16,
    padding: 0,
    minHeight: 300,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
  resetZoomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  resetZoomButton: {
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  resetZoomText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  displayContainer: {
    marginHorizontal: 24,
  },
  displayTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#222',
  },
});

export default Page;