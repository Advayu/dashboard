// utils/draftStorage.ts
const DRAFT_KEY = "offerCreationDraft";

export const saveDraft = (data: any) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
};

export const loadDraft = (): any | null => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

export const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
};
