import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Button, Alert } from 'react-native';
import Papa from 'papaparse';
import RNFS from 'react-native-fs';
import { IconButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';

const App = () => {
  const [data, setData] = useState<string[][]>([]);
  const [currentPath, setCurrentPath] = useState(RNFS.DocumentDirectoryPath);
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([]);

  // 读取目录内容
  const readDirectory = async (path: string) => {
    try {
      const result = await RNFS.readDir(path);
      setFiles(result);
      setCurrentPath(path);
    } catch (error) {
      console.error('读取目录失败:', error);
    }
  };

  // 读取CSV文件
  const readCSVFile = async (filePath: string) => {
    try {
      const content = await RNFS.readFile(filePath, 'utf8');
      Papa.parse(content, {
        complete: (results: { data: string[][] }) => {
          setData(results.data);
        },
        error: (error: Error) => {
          console.error('解析CSV失败:', error);
        }
      });
    } catch (error) {
      console.error('读取文件失败:', error);
    }
  };

  // 打开文件选择器并选择CSV文件
  const pickCSVFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('选择的文件:', file.uri);
        await readCSVFile(file.uri);
      } else {
        console.log('文件选择已取消');
      }
    } catch (error) {
      console.error('选择文件时出错:', error);
      Alert.alert('错误', '选择文件时出错');
    }
  };

  // 处理文件或目录点击
  const handleFilePress = async (file: RNFS.ReadDirItem) => {
    if (file.isDirectory()) {
      await readDirectory(file.path);
    } else if (file.name.toLowerCase().endsWith('.csv')) {
      await readCSVFile(file.path);
    }
  };

  // 返回上级目录
  const goBack = async () => {
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    if (parentPath.length >= RNFS.DocumentDirectoryPath.length) {
      await readDirectory(parentPath);
    }
  };

  // 初始化时读取根目录
  useEffect(() => {
    readDirectory(RNFS.DocumentDirectoryPath);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="返回上级" onPress={goBack} />
        <Button title="浏览CSV文件" onPress={pickCSVFile} />
        <Text>{currentPath}</Text>
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.fileItem}
            onPress={() => handleFilePress(item)}
          >
            <Text>
              {item.isDirectory() ? '📁 ' : '📄 '}
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {data.length > 0 && (
        <View style={styles.csvContent}>
          <Text style={styles.title}>CSV内容:</Text>
          <ScrollView>
            {data.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((cell, j) => (
                  <Text key={j} style={styles.cell}>{cell}</Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  fileItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  csvContent: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    padding: 5,
  },
});

export default App;
