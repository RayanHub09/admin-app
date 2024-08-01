import { Timestamp } from "firebase/firestore";

const serializeData = (data: any): any => {
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    } else if (Array.isArray(data)) {
        return data.map(item => serializeData(item));
    } else if (typeof data === 'object' && data !== null) {
        const serializedObj: any = {};
        for (const key in data) {
            serializedObj[key] = serializeData(data[key]);
        }
        return serializedObj;
    }
    return data;
};

export default serializeData;
