import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useProductos } from '../context/ProductoContext';
import { Ionicons } from '@expo/vector-icons';

export default function NuevoProductoScreen({ navigation }: any) {
    const { addProducto } = useProductos();
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [foto, setFoto] = useState<string | null>(null);

    const [codigoBarras, setCodigoBarras] = useState('');
    const [scaneando, setScaneando] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const tomarFoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) return Alert.alert('Error', 'Permiso denegado');

        const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
        if (!result.canceled && result.assets[0].base64) {
            setFoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
            Alert.alert("Exito", "foto capturada")

        }
    };

    const abrirEscaner = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert('Error', 'Necesitas dar permiso para usar la cámara');
                return;
            }
        }
        setScaneando(true);
    };

    const handleBarcodeScanned = (result: any) => {
        setScaneando(false);
        setCodigoBarras(result.data);
    };

    const guardar = async () => {
        if (!nombre.trim() || !precio.trim()) {
            return Alert.alert('Error', 'El nombre y el precio son obligatorios');
        }

        const productoNuevo: any = {
            nombre,
            precio: parseFloat(precio),
            categoria,
            fotoBase64: foto,
        };

        if (codigoBarras.trim() !== '') {
            productoNuevo.codigoBarras = codigoBarras;
        }

        const exito = await addProducto(productoNuevo);

        if (exito) {
            setNombre(''); setPrecio(''); setCategoria(''); setFoto(null); setCodigoBarras('');
            navigation.navigate('MainTabs', { screen: 'Listado' });
        }
    };

    return (
        <SafeAreaView style={styles.mainBackground} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.mainTitle}>Nuevo Producto</Text>
                <Text style={styles.subTitle}>Completa los datos del producto</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>NOMBRE</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="ejm: Mouse"
                    />

                    <Text style={styles.label}>PRECIO</Text>
                    <TextInput
                        style={styles.input}
                        value={precio}
                        onChangeText={setPrecio}
                        keyboardType="numeric"
                        placeholder="ejm: 15.02"
                    />

                    <Text style={styles.label}>CATEGORÍA</Text>
                    <TextInput
                        style={styles.input}
                        value={categoria}
                        onChangeText={setCategoria}
                        placeholder="ejm:"
                    />

                    <Text style={styles.label}>CÓDIGO DE BARRAS</Text>
                    <TextInput
                        style={styles.input}
                        value={codigoBarras}
                        onChangeText={setCodigoBarras}
                        placeholder="Utiliza el botón escanear para llenar"
                        editable={false}
                    />

                    <View style={styles.imagePreviewWrapper}>
                        {foto ? (
                            <Image source={{ uri: foto }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.emptyImage}>
                                <Ionicons name="image-outline" size={40} color="#999" />
                                <Text style={styles.emptyImageText}>Sin imagen</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionBtn} onPress={tomarFoto}>
                            <Ionicons name="camera" size={24} color="#3b82f6" />
                            <Text style={styles.actionText}>Tomar foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={abrirEscaner}>
                            <Ionicons name="scan-outline" size={24} color="#3b82f6" />
                            <Text style={styles.actionText}>Scanear barras</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={20} color="#ef4444" />
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveBtn} onPress={guardar}>
                        <Ionicons name="save" size={18} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={styles.saveBtnText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={scaneando} animationType="slide">
                <CameraView
                    style={StyleSheet.absoluteFill}
                    onBarcodeScanned={handleBarcodeScanned}
                />
                <TouchableOpacity style={[styles.cancelBtn, { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: '#fff' }]} onPress={() => setScaneando(false)}>
                    <Text style={styles.cancelBtnText}>Cancelar Escáner</Text>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainBackground: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    mainTitle: {
        color: '#1f2937',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subTitle: {
        color: '#6b7280',
        fontSize: 14,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        color: '#10b981',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        color: '#374151',
        borderRadius: 10,
        padding: 12,
        marginBottom: 18,
        fontSize: 15,
    },
    imagePreviewWrapper: {
        alignItems: 'center',
        marginVertical: 10,
    },
    emptyImage: {
        width: 130,
        height: 130,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
    },
    emptyImageText: {
        color: '#9ca3af',
        marginTop: 10,
        fontSize: 14,
    },
    previewImage: {
        width: 130,
        height: 130,
        borderRadius: 16,
        resizeMode: 'cover',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    actionBtn: {
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        color: '#6b7280',
        marginTop: 6,
        fontSize: 13,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.48,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    cancelBtnText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.48,
        backgroundColor: '#10b981',
        paddingVertical: 14,
        borderRadius: 10,
    },
    saveBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});