// uploadStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UploadState {
    listName: string;
    parsedData: any[];
    setUploadData: (name: string, data: any[]) => void;
}

export const useUploadStore = create<UploadState>()(
    persist(
        (set) => ({
            listName: "",
            parsedData: [],
            setUploadData: (name, data) => set({ listName: name, parsedData: data }),
        }),
        {
            name: "upload-storage", // localStorage key
        }
    )
);
