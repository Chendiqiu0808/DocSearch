import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Papa from 'papaparse';
import RNFS from 'react-native-fs';
import { IconButton } from 'react-native-paper';

const App = () => {
  const [data, setData] = useState<string[][]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  // 读取CSV文件
  const loadCSV = async () => {
    try {
      const csvFile = await RNFS.readFileAssets('yourfile.csv');
      Papa.parse(csvFile, {
        complete: (results) => {
          setData(results.data);
        },
        error: (error) => {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 拼音首字母搜索
  const searchData = () => {
    return data.filter(row => 
      row.some(cell => 
        cell.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  // ... existing code ...

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="输入拼音首字母搜索"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      {/* 显示前3条匹配结果 */}
      {searchData().slice(0, 3).map((row, index) => (
        <Text key={index} style={styles.dataText}>
          {row.join(', ')}
        </Text>
      ))}

      {/* 更多结果弹窗 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {searchData().slice(currentPage * 10, (currentPage + 1) * 10).map((row, index) => (
                <Text key={index} style={styles.modalText}>
                  {row.join(', ')}
                </Text>
              ))}
            </ScrollView>
            <IconButton 
              icon="chevron-up" 
              onPress={() => setCurrentPage(Math.max(0, currentPage - 1))} 
            />
            <IconButton 
              icon="chevron-down" 
              onPress={() => setCurrentPage(currentPage + 1)} 
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 },
  dataText: { fontSize: 18, color: '#333', marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { 
    backgroundColor: 'white', 
    margin: 20, 
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%'
  },
  modalText: { fontSize: 20, color: '#000', marginBottom: 15 }
});

export default App;