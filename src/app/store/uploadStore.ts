// /app/store/uploadStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UploadState {
    listName: string;
    parsedData: any[];
    setUploadData: (name: string, data: any[]) => void;
    clearUploadData: () => void;
}

export const useUploadStore = create<UploadState>()(
    persist(
        (set) => ({
            listName: "",
            parsedData: [],
            setUploadData: (name, data) => set({ listName: name, parsedData: data }),
            clearUploadData: () => set({ listName: "", parsedData: [] }),
        }),
        {
            name: "upload-store", // key in localStorage
        }
    )
);
