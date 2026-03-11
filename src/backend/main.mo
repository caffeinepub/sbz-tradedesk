import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Custom Types
  type Document = {
    id : Text;
    ownerId : Principal;
    docType : Text;
    title : Text;
    content : Text;
    buyerName : Text;
    sellerName : Text;
    commodity : Text;
    origin : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type UserProfile = {
    id : Principal;
    name : Text;
    createdAt : Time.Time;
  };

  type UserDto = {
    id : Principal;
    name : Text;
  };

  type DocumentInput = {
    docType : Text;
    title : Text;
    content : Text;
    buyerName : Text;
    sellerName : Text;
    commodity : Text;
    origin : Text;
  };

  module Document {
    public func compare(d1 : Document, d2 : Document) : Order.Order {
      Text.compare(d1.id, d2.id);
    };
  };

  // State management
  let docStore = Map.empty<Text, Document>();
  let userStore = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // Helper Functions
  func getUserOrTrap(userId : Principal) : UserProfile {
    switch (userStore.get(userId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) { user };
    };
  };

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userStore.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let now = Time.now();
    let profile : UserProfile = {
      id = caller;
      name = name;
      createdAt = now;
    };
    userStore.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    getUserOrTrap(userId);
  };

  public shared ({ caller }) func updateUserName(newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their profile");
    };
    let user = getUserOrTrap(caller);
    let updated : UserProfile = { user with name = newName };
    userStore.add(caller, updated);
  };

  // Document Functions
  public shared ({ caller }) func createDocument(input : DocumentInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create documents");
    };

    let docId = Time.now().toText();
    let now = Time.now();
    let doc : Document = {
      id = docId;
      ownerId = caller;
      docType = input.docType;
      title = input.title;
      content = input.content;
      buyerName = input.buyerName;
      sellerName = input.sellerName;
      commodity = input.commodity;
      origin = input.origin;
      createdAt = now;
      updatedAt = now;
    };

    docStore.add(docId, doc);
    docId;
  };

  public query ({ caller }) func getDocument(docId : Text) : async Document {
    switch (docStore.get(docId)) {
      case (null) { Runtime.trap("Document does not exist") };
      case (?doc) { doc };
    };
  };

  public query ({ caller }) func listUserDocuments(userId : Principal) : async [Document] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only list your own documents");
    };
    let iter = docStore.values().filter(func(doc) { doc.ownerId == userId });
    iter.toArray().sort();
  };

  public shared ({ caller }) func updateDocument(docId : Text, input : DocumentInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update documents");
    };

    let doc = switch (docStore.get(docId)) {
      case (null) { Runtime.trap("Document does not exist") };
      case (?d) { d };
    };

    if (doc.ownerId != caller) {
      Runtime.trap("Unauthorized: Only document owner can update");
    };

    let updated : Document = {
      doc with
      docType = input.docType;
      title = input.title;
      content = input.content;
      buyerName = input.buyerName;
      sellerName = input.sellerName;
      commodity = input.commodity;
      origin = input.origin;
      updatedAt = Time.now();
    };

    docStore.add(docId, updated);
  };

  public shared ({ caller }) func deleteDocument(docId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete documents");
    };

    let doc = switch (docStore.get(docId)) {
      case (null) { Runtime.trap("Document does not exist") };
      case (?d) { d };
    };

    if (doc.ownerId != caller) {
      Runtime.trap("Unauthorized: Only document owner can delete");
    };

    docStore.remove(docId);
  };

  public query ({ caller }) func searchDocumentsByField(field : Text, value : Text) : async [Document] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search documents");
    };

    let iter = docStore.values().filter(
      func(doc) {
        switch (field) {
          case ("buyer") { Text.equal(doc.buyerName, value) };
          case ("seller") { Text.equal(doc.sellerName, value) };
          case ("commodity") { Text.equal(doc.commodity, value) };
          case ("origin") { Text.equal(doc.origin, value) };
          case (_) { false };
        };
      }
    );
    iter.toArray().sort();
  };

  public query ({ caller }) func getAllUsers() : async [UserDto] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list users");
    };
    userStore.values().toArray().map(
      func(user) { { id = user.id; name = user.name } }
    );
  };

  public query ({ caller }) func getAllDocuments() : async [Document] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list documents");
    };
    docStore.values().toArray().sort();
  };
};
