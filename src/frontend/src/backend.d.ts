import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DocumentInput {
    title: string;
    content: string;
    origin: string;
    sellerName: string;
    buyerName: string;
    commodity: string;
    docType: string;
}
export interface Document {
    id: string;
    title: string;
    content: string;
    ownerId: Principal;
    createdAt: Time;
    origin: string;
    sellerName: string;
    updatedAt: Time;
    buyerName: string;
    commodity: string;
    docType: string;
}
export type Time = bigint;
export interface UserProfile {
    id: Principal;
    name: string;
    createdAt: Time;
}
export interface UserDto {
    id: Principal;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDocument(input: DocumentInput): Promise<string>;
    deleteDocument(docId: string): Promise<void>;
    getAllDocuments(): Promise<Array<Document>>;
    getAllUsers(): Promise<Array<UserDto>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDocument(docId: string): Promise<Document>;
    getUserProfile(userId: Principal): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    listUserDocuments(userId: Principal): Promise<Array<Document>>;
    saveCallerUserProfile(name: string): Promise<void>;
    searchDocumentsByField(field: string, value: string): Promise<Array<Document>>;
    updateDocument(docId: string, input: DocumentInput): Promise<void>;
    updateUserName(newName: string): Promise<void>;
}
