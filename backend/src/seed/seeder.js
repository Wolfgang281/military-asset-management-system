import { connectDB } from "../config/index.js";
import {
  AssetModel,
  AssignmentModel,
  AuditLogModel,
  PurchaseModel,
  TransferModel,
  UserModel,
} from "../models/index.js";

async function seed() {
  connectDB()
    .then(async () => {
      console.log("Connected to MongoDB");

      await Promise.all([
        UserModel.deleteMany({}),
        AssetModel.deleteMany({}),
        PurchaseModel.deleteMany({}),
        TransferModel.deleteMany({}),
        AssignmentModel.deleteMany({}),
        AuditLogModel.deleteMany({}),
      ]);
      console.log("Cleared all collections");

      //! ── USERS ───────────────────────────────────────────────
      // Using .create() one by one so the pre("save") hook runs and hashes passwords
      const admin = await UserModel.create({
        name: "Maj. Gen. Arjun Sharma",
        email: "admin@indianarmy.mil",
        passwordHash: "Admin@123",
        role: "admin",
        assignedBase: null,
        isActive: true,
      });

      const cmdNorth = await UserModel.create({
        name: "Col. Vikram Singh Rathore",
        email: "commander.northern@indianarmy.mil",
        passwordHash: "Base@123",
        role: "base_commander",
        assignedBase: "Northern Command - Udhampur",
        isActive: true,
      });

      const cmdWest = await UserModel.create({
        name: "Col. Pradeep Nair",
        email: "commander.western@indianarmy.mil",
        passwordHash: "Base@123",
        role: "base_commander",
        assignedBase: "Western Command - Chandimandir",
        isActive: true,
      });

      const cmdSouth = await UserModel.create({
        name: "Col. Suresh Menon",
        email: "commander.southern@indianarmy.mil",
        passwordHash: "Base@123",
        role: "base_commander",
        assignedBase: "Southern Command - Pune",
        isActive: true,
      });

      const logOfficer = await UserModel.create({
        name: "Lt. Col. Rajesh Gupta",
        email: "logistics@indianarmy.mil",
        passwordHash: "Logistics@123",
        role: "logistics",
        assignedBase: null,
        isActive: true,
      });

      await UserModel.create({
        name: "Lt. Col. Anita Desai",
        email: "logistics2@indianarmy.mil",
        passwordHash: "Logistics@123",
        role: "logistics",
        assignedBase: null,
        isActive: true,
      });

      console.log("Users created: 6");

      //! ── ASSETS ───────────────────────────────────────────────
      const assets = await AssetModel.insertMany([
        {
          name: "INSAS Rifle",
          category: "weapons",
          unit: "units",
          description:
            "Indian Small Arms System — standard infantry rifle, 5.56mm",
        },
        {
          name: "AK-203 Rifle",
          category: "weapons",
          unit: "units",
          description: "Indo-Russian joint venture assault rifle, 7.62mm",
        },
        {
          name: "Dragunov SVD Sniper Rifle",
          category: "weapons",
          unit: "units",
          description: "Semi-automatic sniper rifle used by Indian Army",
        },
        {
          name: "ATAGS Howitzer",
          category: "weapons",
          unit: "units",
          description: "Advanced Towed Artillery Gun System, 155mm/52 calibre",
        },
        {
          name: "Arjun MBT Mk-1A",
          category: "vehicles",
          unit: "units",
          description: "Indigenously designed main battle tank by DRDO/CVRDE",
        },
        {
          name: "BMP-2 Sarath IFV",
          category: "vehicles",
          unit: "units",
          description: "Infantry Fighting Vehicle, licensed Indian production",
        },
        {
          name: "Tata LPTA 715",
          category: "vehicles",
          unit: "units",
          description: "Light tactical utility truck used across Indian Army",
        },
        {
          name: "Ashok Leyland Stallion",
          category: "vehicles",
          unit: "units",
          description: "Medium mobility 6x6 tactical truck",
        },
        {
          name: "5.56mm INSAS Rounds",
          category: "ammunition",
          unit: "rounds",
          description: "Standard rifle ammunition for INSAS",
        },
        {
          name: "7.62mm AK-203 Rounds",
          category: "ammunition",
          unit: "rounds",
          description: "Assault rifle ammunition for AK-203",
        },
        {
          name: "155mm Artillery Shells",
          category: "ammunition",
          unit: "rounds",
          description: "Artillery rounds for ATAGS Howitzer",
        },
        {
          name: "Body Armour Mk-III",
          category: "equipment",
          unit: "sets",
          description: "DRDO-developed bulletproof jacket with ceramic plates",
        },
        {
          name: "Combat Helmet (PASGT)",
          category: "equipment",
          unit: "units",
          description: "Ballistic helmet standard issue Indian Army",
        },
        {
          name: "Harris RF-7800 Radio",
          category: "equipment",
          unit: "units",
          description: "Tactical handheld radio set used by Indian Army",
        },
      ]);

      const insas = assets[0];
      const ak203 = assets[1];
      const atags = assets[3];
      const arjun = assets[4];
      const sarath = assets[5];
      const lpta = assets[6];
      const ammo556 = assets[8];
      const ammo762 = assets[9];
      const bodyArmour = assets[11];
      const helmet = assets[12];
      const radio = assets[13];

      console.log("Assets created:", assets.length);

      //! ── PURCHASES ───────────────────────────────────────────────
      const purchases = await PurchaseModel.insertMany([
        {
          asset: insas._id,
          base: "Northern Command - Udhampur",
          quantity: 200,
          purchaseDate: new Date("2025-01-05"),
          supplierRef: "OFB-2025-001",
          createdBy: logOfficer._id,
          notes:
            "Annual infantry weapons procurement from Ordnance Factory Board",
        },
        {
          asset: ammo556._id,
          base: "Northern Command - Udhampur",
          quantity: 80000,
          purchaseDate: new Date("2025-01-08"),
          supplierRef: "OFB-2025-002",
          createdBy: logOfficer._id,
          notes: "Q1 ammunition stock for Northern Command",
        },
        {
          asset: lpta._id,
          base: "Northern Command - Udhampur",
          quantity: 15,
          purchaseDate: new Date("2025-01-12"),
          supplierRef: "TATA-2025-003",
          createdBy: admin._id,
          notes: "High altitude vehicle fleet expansion",
        },
        {
          asset: bodyArmour._id,
          base: "Northern Command - Udhampur",
          quantity: 300,
          purchaseDate: new Date("2025-01-20"),
          supplierRef: "DRDO-2025-004",
          createdBy: logOfficer._id,
          notes: "Protective gear for forward troops",
        },
        {
          asset: radio._id,
          base: "Northern Command - Udhampur",
          quantity: 60,
          purchaseDate: new Date("2025-02-03"),
          supplierRef: "BEL-2025-010",
          createdBy: logOfficer._id,
          notes: "Tactical comms upgrade — high altitude posts",
        },
        {
          asset: ak203._id,
          base: "Western Command - Chandimandir",
          quantity: 150,
          purchaseDate: new Date("2025-01-06"),
          supplierRef: "OFB-2025-005",
          createdBy: logOfficer._id,
          notes: "AK-203 induction under Indo-Russian programme",
        },
        {
          asset: arjun._id,
          base: "Western Command - Chandimandir",
          quantity: 8,
          purchaseDate: new Date("2025-01-10"),
          supplierRef: "DRDO-2025-006",
          createdBy: admin._id,
          notes: "Arjun Mk-1A induction from HVF Avadi",
        },
        {
          asset: ammo762._id,
          base: "Western Command - Chandimandir",
          quantity: 40000,
          purchaseDate: new Date("2025-01-15"),
          supplierRef: "OFB-2025-007",
          createdBy: logOfficer._id,
          notes: "AK-203 ammunition stock",
        },
        {
          asset: sarath._id,
          base: "Western Command - Chandimandir",
          quantity: 6,
          purchaseDate: new Date("2025-02-01"),
          supplierRef: "OFB-2025-011",
          createdBy: admin._id,
          notes: "BMP-2 Sarath IFV replacement batch",
        },
        {
          asset: atags._id,
          base: "Southern Command - Pune",
          quantity: 4,
          purchaseDate: new Date("2025-01-07"),
          supplierRef: "DRDO-2025-008",
          createdBy: logOfficer._id,
          notes: "ATAGS induction for artillery regiment",
        },
        {
          asset: insas._id,
          base: "Southern Command - Pune",
          quantity: 120,
          purchaseDate: new Date("2025-01-18"),
          supplierRef: "OFB-2025-009",
          createdBy: logOfficer._id,
          notes: "Standard infantry procurement",
        },
        {
          asset: helmet._id,
          base: "Southern Command - Pune",
          quantity: 250,
          purchaseDate: new Date("2025-01-22"),
          supplierRef: "MKU-2025-012",
          createdBy: logOfficer._id,
          notes: "Ballistic helmet replacement batch",
        },
        {
          asset: radio._id,
          base: "Southern Command - Pune",
          quantity: 45,
          purchaseDate: new Date("2025-02-10"),
          supplierRef: "BEL-2025-013",
          createdBy: logOfficer._id,
          notes: "BEL tactical radio upgrade",
        },
        {
          asset: insas._id,
          base: "Forward Ops - Siachen",
          quantity: 60,
          purchaseDate: new Date("2025-02-05"),
          supplierRef: "OFB-2025-014",
          createdBy: admin._id,
          notes: "Glacier deployment kit",
        },
        {
          asset: ammo556._id,
          base: "Forward Ops - Siachen",
          quantity: 20000,
          purchaseDate: new Date("2025-02-05"),
          supplierRef: "OFB-2025-015",
          createdBy: admin._id,
          notes: "Forward post ammunition resupply",
        },
      ]);

      console.log("Purchases created:", purchases.length);

      //! ── TRANSFERS ───────────────────────────────────────────────
      const transfers = await TransferModel.insertMany([
        {
          asset: insas._id,
          fromBase: "Northern Command - Udhampur",
          toBase: "Western Command - Chandimandir",
          quantity: 40,
          transferDate: new Date("2025-01-14"),
          status: "completed",
          authorizedBy: cmdNorth._id,
          notes: "Rebalancing infantry weapons between commands",
        },
        {
          asset: ammo556._id,
          fromBase: "Northern Command - Udhampur",
          toBase: "Forward Ops - Siachen",
          quantity: 15000,
          transferDate: new Date("2025-01-16"),
          status: "completed",
          authorizedBy: admin._id,
          notes: "Siachen forward post resupply",
        },
        {
          asset: lpta._id,
          fromBase: "Western Command - Chandimandir",
          toBase: "Southern Command - Pune",
          quantity: 3,
          transferDate: new Date("2025-01-20"),
          status: "completed",
          authorizedBy: cmdWest._id,
          notes: "Vehicle reallocation — southern exercise",
        },
        {
          asset: bodyArmour._id,
          fromBase: "Northern Command - Udhampur",
          toBase: "Forward Ops - Siachen",
          quantity: 50,
          transferDate: new Date("2025-01-25"),
          status: "completed",
          authorizedBy: logOfficer._id,
          notes: "Protective gear for glacier deployment",
        },
        {
          asset: radio._id,
          fromBase: "Southern Command - Pune",
          toBase: "Northern Command - Udhampur",
          quantity: 12,
          transferDate: new Date("2025-02-02"),
          status: "completed",
          authorizedBy: logOfficer._id,
          notes: "Tactical radios for high altitude comms upgrade",
        },
        {
          asset: ak203._id,
          fromBase: "Western Command - Chandimandir",
          toBase: "Forward Ops - Siachen",
          quantity: 25,
          transferDate: new Date("2025-02-12"),
          status: "in_transit",
          authorizedBy: admin._id,
          notes: "AK-203 induction at forward posts",
        },
        {
          asset: helmet._id,
          fromBase: "Southern Command - Pune",
          toBase: "Western Command - Chandimandir",
          quantity: 80,
          transferDate: new Date("2025-02-14"),
          status: "in_transit",
          authorizedBy: logOfficer._id,
          notes: "Helmet replacement batch en route",
        },
        {
          asset: insas._id,
          fromBase: "Northern Command - Udhampur",
          toBase: "Southern Command - Pune",
          quantity: 30,
          transferDate: new Date("2025-02-18"),
          status: "pending",
          authorizedBy: cmdNorth._id,
          notes: "Awaiting Southern Command confirmation",
        },
        {
          asset: ammo762._id,
          fromBase: "Western Command - Chandimandir",
          toBase: "Forward Ops - Siachen",
          quantity: 8000,
          transferDate: new Date("2025-02-19"),
          status: "pending",
          authorizedBy: logOfficer._id,
          notes: "AK-203 ammo for Siachen posts",
        },
      ]);

      console.log("Transfers created:", transfers.length);

      //! ── ASSIGNMENTS ───────────────────────────────────────────────
      const assignments = await AssignmentModel.insertMany([
        {
          asset: insas._id,
          base: "Northern Command - Udhampur",
          personnelName: "Havildar Balwinder Singh",
          personnelId: "IC-441-2201",
          serialNumber: "INSAS-SN-4521",
          quantity: 1,
          assignedDate: new Date("2025-01-13"),
          status: "active",
          assignedBy: cmdNorth._id,
          notes: "",
        },
        {
          asset: insas._id,
          base: "Northern Command - Udhampur",
          personnelName: "Naik Ramesh Yadav",
          personnelId: "IC-441-2202",
          serialNumber: "INSAS-SN-4522",
          quantity: 1,
          assignedDate: new Date("2025-01-13"),
          status: "active",
          assignedBy: cmdNorth._id,
          notes: "",
        },
        {
          asset: radio._id,
          base: "Northern Command - Udhampur",
          personnelName: "Sepoy Arun Kumar",
          personnelId: "IC-441-0011",
          serialNumber: "RADIO-SN-1101",
          quantity: 1,
          assignedDate: new Date("2025-01-14"),
          status: "active",
          assignedBy: cmdNorth._id,
          notes: "Assigned to signals section",
        },
        {
          asset: bodyArmour._id,
          base: "Northern Command - Udhampur",
          personnelName: "Havildar Balwinder Singh",
          personnelId: "IC-441-2201",
          serialNumber: null,
          quantity: 1,
          assignedDate: new Date("2025-01-21"),
          status: "active",
          assignedBy: cmdNorth._id,
          notes: "",
        },
        {
          asset: lpta._id,
          base: "Northern Command - Udhampur",
          personnelName: "Driver Sukhdev Thapa",
          personnelId: "IC-441-3301",
          serialNumber: "LPTA-N-07",
          quantity: 1,
          assignedDate: new Date("2025-01-22"),
          status: "active",
          assignedBy: cmdNorth._id,
          notes: "Assigned as primary driver — high altitude route",
        },
        {
          asset: ammo556._id,
          base: "Northern Command - Udhampur",
          personnelName: "Havildar Balwinder Singh",
          personnelId: "IC-441-2201",
          serialNumber: null,
          quantity: 500,
          assignedDate: new Date("2025-01-15"),
          status: "expended",
          expendedDate: new Date("2025-01-15"),
          assignedBy: cmdNorth._id,
          notes: "Annual firing practice — Udhampur ranges",
        },
        {
          asset: ammo556._id,
          base: "Northern Command - Udhampur",
          personnelName: "Naik Ramesh Yadav",
          personnelId: "IC-441-2202",
          serialNumber: null,
          quantity: 500,
          assignedDate: new Date("2025-01-15"),
          status: "expended",
          expendedDate: new Date("2025-01-15"),
          assignedBy: cmdNorth._id,
          notes: "Annual firing practice — Udhampur ranges",
        },
        {
          asset: ak203._id,
          base: "Western Command - Chandimandir",
          personnelName: "Havildar Gurpreet Sandhu",
          personnelId: "IC-442-2211",
          serialNumber: "AK203-SN-6601",
          quantity: 1,
          assignedDate: new Date("2025-01-17"),
          status: "active",
          assignedBy: cmdWest._id,
          notes: "",
        },
        {
          asset: ak203._id,
          base: "Western Command - Chandimandir",
          personnelName: "Sepoy Harjinder Kaur",
          personnelId: "IC-442-3302",
          serialNumber: "AK203-SN-6602",
          quantity: 1,
          assignedDate: new Date("2025-01-17"),
          status: "active",
          assignedBy: cmdWest._id,
          notes: "",
        },
        {
          asset: sarath._id,
          base: "Western Command - Chandimandir",
          personnelName: "Driver Manpreet Gill",
          personnelId: "IC-442-2215",
          serialNumber: "SARATH-W-02",
          quantity: 1,
          assignedDate: new Date("2025-02-03"),
          status: "active",
          assignedBy: cmdWest._id,
          notes: "IFV crew assignment",
        },
        {
          asset: insas._id,
          base: "Western Command - Chandimandir",
          personnelName: "Naik Tejinder Bhatia",
          personnelId: "IC-442-0012",
          serialNumber: "INSAS-SN-2201",
          quantity: 1,
          assignedDate: new Date("2025-01-11"),
          status: "returned",
          assignedBy: cmdWest._id,
          notes: "Returned after posting transfer",
        },
        {
          asset: atags._id,
          base: "Southern Command - Pune",
          personnelName: "Nb. Sub. Krishnamurthy R.",
          personnelId: "IC-443-2231",
          serialNumber: "ATAGS-SN-0011",
          quantity: 1,
          assignedDate: new Date("2025-01-19"),
          status: "active",
          assignedBy: cmdSouth._id,
          notes: "Artillery regiment — gun commander",
        },
        {
          asset: radio._id,
          base: "Southern Command - Pune",
          personnelName: "Nb. Sub. Krishnamurthy R.",
          personnelId: "IC-443-2231",
          serialNumber: "RADIO-SN-0088",
          quantity: 1,
          assignedDate: new Date("2025-01-23"),
          status: "active",
          assignedBy: cmdSouth._id,
          notes: "Forward observer comms",
        },
        {
          asset: ammo556._id,
          base: "Southern Command - Pune",
          personnelName: "Nb. Sub. Krishnamurthy R.",
          personnelId: "IC-443-2231",
          serialNumber: null,
          quantity: 800,
          assignedDate: new Date("2025-01-25"),
          status: "expended",
          expendedDate: new Date("2025-01-25"),
          assignedBy: cmdSouth._id,
          notes: "Exercise Dakshin Shakti — all rounds expended",
        },
        {
          asset: insas._id,
          base: "Forward Ops - Siachen",
          personnelName: "Sepoy Dhanraj Tamang",
          personnelId: "IC-445-3401",
          serialNumber: "INSAS-SN-9901",
          quantity: 1,
          assignedDate: new Date("2025-02-07"),
          status: "active",
          assignedBy: admin._id,
          notes: "Siachen glacier post deployment",
        },
        {
          asset: bodyArmour._id,
          base: "Forward Ops - Siachen",
          personnelName: "Sepoy Dhanraj Tamang",
          personnelId: "IC-445-3401",
          serialNumber: null,
          quantity: 1,
          assignedDate: new Date("2025-02-07"),
          status: "active",
          assignedBy: admin._id,
          notes: "",
        },
      ]);

      console.log("Assignments created:", assignments.length);

      //! ── AUDIT LOGS ───────────────────────────────────────────────
      await AuditLogModel.insertMany([
        {
          userId: admin._id,
          userName: "Maj. Gen. Arjun Sharma",
          userRole: "admin",
          action: "LOGIN",
          resource: "Auth",
          resourceId: null,
          detail: "Admin login from Army HQ terminal — New Delhi",
          ipAddress: "10.0.0.1",
          method: "POST",
          endpoint: "/api/auth/login",
          statusCode: 200,
          timestamp: new Date("2025-01-05T08:00:00Z"),
        },
        {
          userId: logOfficer._id,
          userName: "Lt. Col. Rajesh Gupta",
          userRole: "logistics",
          action: "CREATE_PURCHASE",
          resource: "Purchase",
          resourceId: purchases[0]._id,
          detail:
            "Purchased 200x INSAS Rifles for Northern Command — OFB-2025-001",
          ipAddress: "10.0.1.22",
          method: "POST",
          endpoint: "/api/purchases",
          statusCode: 201,
          timestamp: new Date("2025-01-05T09:15:00Z"),
        },
        {
          userId: logOfficer._id,
          userName: "Lt. Col. Rajesh Gupta",
          userRole: "logistics",
          action: "CREATE_PURCHASE",
          resource: "Purchase",
          resourceId: purchases[1]._id,
          detail:
            "Purchased 80000x 5.56mm Rounds for Northern Command — OFB-2025-002",
          ipAddress: "10.0.1.22",
          method: "POST",
          endpoint: "/api/purchases",
          statusCode: 201,
          timestamp: new Date("2025-01-08T10:30:00Z"),
        },
        {
          userId: cmdNorth._id,
          userName: "Col. Vikram Singh Rathore",
          userRole: "base_commander",
          action: "CREATE_TRANSFER",
          resource: "Transfer",
          resourceId: transfers[0]._id,
          detail:
            "Initiated transfer: 40x INSAS Rifles — Northern to Western Command",
          ipAddress: "10.0.1.45",
          method: "POST",
          endpoint: "/api/transfers",
          statusCode: 201,
          timestamp: new Date("2025-01-14T11:20:00Z"),
        },
        {
          userId: cmdNorth._id,
          userName: "Col. Vikram Singh Rathore",
          userRole: "base_commander",
          action: "CREATE_ASSIGNMENT",
          resource: "Assignment",
          resourceId: assignments[0]._id,
          detail:
            "Assigned 1x INSAS Rifle (SN: INSAS-SN-4521) to Havildar Balwinder Singh",
          ipAddress: "10.0.1.45",
          method: "POST",
          endpoint: "/api/assignments",
          statusCode: 201,
          timestamp: new Date("2025-01-13T14:00:00Z"),
        },
        {
          userId: logOfficer._id,
          userName: "Lt. Col. Rajesh Gupta",
          userRole: "logistics",
          action: "UPDATE_TRANSFER_STATUS",
          resource: "Transfer",
          resourceId: transfers[0]._id,
          detail:
            "Transfer completed: 40x INSAS Rifles — Northern to Western Command",
          ipAddress: "10.0.1.22",
          method: "PATCH",
          endpoint: "/api/transfers/" + transfers[0]._id + "/status",
          statusCode: 200,
          timestamp: new Date("2025-01-16T09:00:00Z"),
        },
        {
          userId: cmdNorth._id,
          userName: "Col. Vikram Singh Rathore",
          userRole: "base_commander",
          action: "EXPEND_ASSET",
          resource: "Assignment",
          resourceId: assignments[5]._id,
          detail:
            "Marked 500x 5.56mm Rounds as expended — Havildar Balwinder Singh — Annual firing practice",
          ipAddress: "10.0.1.45",
          method: "PATCH",
          endpoint: "/api/assignments/" + assignments[5]._id + "/expend",
          statusCode: 200,
          timestamp: new Date("2025-01-15T16:45:00Z"),
        },
        {
          userId: admin._id,
          userName: "Maj. Gen. Arjun Sharma",
          userRole: "admin",
          action: "CREATE_USER",
          resource: "User",
          resourceId: null,
          detail: "Created new logistics officer account: Lt. Col. Anita Desai",
          ipAddress: "10.0.0.1",
          method: "POST",
          endpoint: "/api/users",
          statusCode: 201,
          timestamp: new Date("2025-01-20T08:30:00Z"),
        },
      ]);

      console.log("Audit logs created: 8");
      console.log("\nSeed complete!\n");
      console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      console.log("LOGIN CREDENTIALS");
      console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      console.table([
        { Role: "Admin", Email: "admin@indianarmy.mil", Password: "Admin@123" },
        {
          Role: "Cmd Northern",
          Email: "commander.northern@indianarmy.mil",
          Password: "Base@123",
        },
        {
          Role: "Cmd Western",
          Email: "commander.western@indianarmy.mil",
          Password: "Base@123",
        },
        {
          Role: "Cmd Southern",
          Email: "commander.southern@indianarmy.mil",
          Password: "Base@123",
        },
        {
          Role: "Logistics 1",
          Email: "logistics@indianarmy.mil",
          Password: "Logistics@123",
        },
        {
          Role: "Logistics 2",
          Email: "logistics2@indianarmy.mil",
          Password: "Logistics@123",
        },
      ]);
      console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
      );
    })
    .catch((err) => {
      console.log("Error while connecting with database:", err);
    });
}

export default seed;
