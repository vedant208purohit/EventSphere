import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(data, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('QR Code generation error:', error);
        return '';
    }
};
