module.exports = [
"[project]/app/lib/actions/auth-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"000e01556ed40dbc2a4f10777b9e7c673edf275859":"signOutAction","401024374ad4e484a00123d87e1aaee226eb95a960":"preAuthenticate","6095436ed47bcbf1e0a77f7eb6a6084305dc033d5c":"registerUser","60be66a202d772940bea322562258910466041fa00":"authenticate"},"",""] */ __turbopack_context__.s([
    "authenticate",
    ()=>authenticate,
    "preAuthenticate",
    ()=>preAuthenticate,
    "registerUser",
    ()=>registerUser,
    "signOutAction",
    ()=>signOutAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
// Schema for the initial password check
const PreAuthSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(6)
});
async function preAuthenticate(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    console.log('Pre-auth input:', {
        email,
        password
    });
    const validatedFields = PreAuthSchema.safeParse({
        email,
        password
    });
    if (!validatedFields.success) {
        return {
            error: 'Invalid email or password format.'
        };
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) return {
            error: 'Invalid credentials.'
        };
        const passwordsMatch = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
        if (!passwordsMatch) return {
            error: 'Invalid credentials.'
        };
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        // Save OTP to DB
        await prisma.user.update({
            where: {
                email
            },
            // @ts-ignore
            data: {
                otp,
                otpExpires
            }
        });
        console.log(`🔐 OTP for ${email}: ${otp}`); // In real app, send via email/SMS
        return {
            success: true,
            message: 'OTP sent to your email.'
        };
    } catch (error) {
        console.error('Pre-auth error:', error);
        return {
            error: 'Something went wrong.'
        };
    }
}
async function authenticate(prevState, formData) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"])('credentials', formData);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthError"]) {
            switch(error.type){
                case 'CredentialsSignin':
                    return 'Invalid OTP or credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
const RegisterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, {
        message: 'Name must be at least 2 characters long.'
    }),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email({
        message: 'Please enter a valid email address.'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(6, {
        message: 'Password must be at least 6 characters long.'
    }),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: [
        "confirmPassword"
    ]
});
async function registerUser(prevState, formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const validatedFields = RegisterSchema.safeParse({
        name,
        email,
        password,
        confirmPassword
    });
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors
        };
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return {
                error: {
                    email: [
                        'Email already in use.'
                    ]
                }
            };
        }
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER'
            }
        });
        return {
            success: true,
            message: 'Account created successfully. Please log in.'
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            error: {
                form: [
                    'Something went wrong. Please try again.'
                ]
            }
        };
    }
}
async function signOutAction() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"])();
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    preAuthenticate,
    authenticate,
    registerUser,
    signOutAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(preAuthenticate, "401024374ad4e484a00123d87e1aaee226eb95a960", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(authenticate, "60be66a202d772940bea322562258910466041fa00", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerUser, "6095436ed47bcbf1e0a77f7eb6a6084305dc033d5c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOutAction, "000e01556ed40dbc2a4f10777b9e7c673edf275859", null);
}),
"[project]/app/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/app/lib/services.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdjustmentOperationService",
    ()=>createAdjustmentOperationService,
    "createInboundOperationService",
    ()=>createInboundOperationService,
    "createOutboundOperationService",
    ()=>createOutboundOperationService,
    "createProductService",
    ()=>createProductService,
    "getDashboardMetricsService",
    ()=>getDashboardMetricsService,
    "getLocationsService",
    ()=>getLocationsService,
    "getMoveHistoryService",
    ()=>getMoveHistoryService,
    "getProductStockService",
    ()=>getProductStockService,
    "validateOperationService",
    ()=>validateOperationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/prisma.ts [app-rsc] (ecmascript)");
;
async function createProductService(data) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
        where: {
            sku: data.sku
        }
    });
    if (existing) {
        throw new Error('Product with this SKU already exists');
    }
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.create({
        data: {
            ...data,
            currentStock: 0
        }
    });
}
async function getProductStockService(productId) {
    const product = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
        where: {
            id: productId
        },
        select: {
            currentStock: true
        }
    });
    return product?.currentStock || 0;
}
// --- Operations Services ---
async function generateOperationReference(type) {
    const count = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operation.count({
        where: {
            type
        }
    });
    const code = type === 'RECEIPT' ? 'IN' : type === 'DELIVERY' ? 'OUT' : 'ADJ';
    return `WH/${code}/${(count + 1).toString().padStart(4, '0')}`;
}
async function createInboundOperationService(items) {
    const vendor = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findFirst({
        where: {
            type: 'VENDOR'
        }
    });
    const warehouse = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findFirst({
        where: {
            type: 'INTERNAL'
        }
    });
    if (!vendor || !warehouse) throw new Error('Missing default locations');
    const reference = await generateOperationReference('RECEIPT');
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operation.create({
        data: {
            type: 'RECEIPT',
            status: 'DRAFT',
            reference,
            moves: {
                create: items.map((item)=>({
                        productId: item.productId,
                        quantity: item.quantity,
                        sourceLocationId: vendor.id,
                        destLocationId: warehouse.id,
                        status: 'DRAFT'
                    }))
            }
        }
    });
}
async function createOutboundOperationService(items) {
    const warehouse = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findFirst({
        where: {
            type: 'INTERNAL'
        }
    });
    const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findFirst({
        where: {
            type: 'CUSTOMER'
        }
    });
    if (!warehouse || !customer) throw new Error('Missing default locations');
    const reference = await generateOperationReference('DELIVERY');
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operation.create({
        data: {
            type: 'DELIVERY',
            status: 'DRAFT',
            reference,
            moves: {
                create: items.map((item)=>({
                        productId: item.productId,
                        quantity: item.quantity,
                        sourceLocationId: warehouse.id,
                        destLocationId: customer.id,
                        status: 'DRAFT'
                    }))
            }
        }
    });
}
async function createAdjustmentOperationService(items, type) {
    const warehouse = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findFirst({
        where: {
            type: 'INTERNAL'
        }
    });
    const inventoryLoss = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findFirst({
        where: {
            type: 'INVENTORY_LOSS'
        }
    });
    if (!warehouse || !inventoryLoss) throw new Error('Missing default locations');
    const reference = await generateOperationReference('ADJUSTMENT');
    const sourceId = type === 'GAIN' ? inventoryLoss.id : warehouse.id;
    const destId = type === 'GAIN' ? warehouse.id : inventoryLoss.id;
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operation.create({
        data: {
            type: 'ADJUSTMENT',
            status: 'DRAFT',
            reference,
            moves: {
                create: items.map((item)=>({
                        productId: item.productId,
                        quantity: item.quantity,
                        sourceLocationId: sourceId,
                        destLocationId: destId,
                        status: 'DRAFT'
                    }))
            }
        }
    });
}
async function validateOperationService(operationId) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        const operation = await tx.operation.findUnique({
            where: {
                id: operationId
            },
            include: {
                moves: {
                    include: {
                        product: true,
                        sourceLocation: true,
                        destLocation: true
                    }
                }
            }
        });
        if (!operation) throw new Error('Operation not found');
        if (operation.status === 'DONE') throw new Error('Operation already validated');
        // 1. Check Stock Availability for Outgoing Moves
        for (const move of operation.moves){
            if (move.sourceLocation.type === 'INTERNAL' && move.destLocation.type !== 'INTERNAL') {
                if (move.product.currentStock < move.quantity) {
                    throw new Error(`Insufficient stock for ${move.product.name} (Requested: ${move.quantity}, Available: ${move.product.currentStock})`);
                }
            }
        }
        // 2. Update Operation and Moves Status
        await tx.operation.update({
            where: {
                id: operationId
            },
            data: {
                status: 'DONE'
            }
        });
        await tx.stockMove.updateMany({
            where: {
                operationId
            },
            data: {
                status: 'DONE'
            }
        });
        // 3. Update Product Stock based on Locations
        for (const move of operation.moves){
            let adjustment = 0;
            const isSourceInternal = move.sourceLocation.type === 'INTERNAL';
            const isDestInternal = move.destLocation.type === 'INTERNAL';
            if (isDestInternal && !isSourceInternal) {
                // Incoming (Receipt or Gain)
                adjustment = move.quantity;
            } else if (isSourceInternal && !isDestInternal) {
                // Outgoing (Delivery or Loss)
                adjustment = -move.quantity;
            }
            // Internal Transfer (Internal -> Internal) results in 0 net change for the product globally, 
            // but if we tracked stock per location, we would handle it here. 
            // Since Product.currentStock is global, we ignore transfers.
            if (adjustment !== 0) {
                await tx.product.update({
                    where: {
                        id: move.productId
                    },
                    data: {
                        currentStock: {
                            increment: adjustment
                        }
                    }
                });
            }
        }
    });
}
async function getMoveHistoryService(productId) {
    const where = productId ? {
        productId
    } : {};
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].stockMove.findMany({
        where,
        include: {
            sourceLocation: true,
            destLocation: true,
            operation: true,
            product: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
async function getLocationsService(type) {
    const where = type === 'INTERNAL' ? {
        type: 'INTERNAL'
    } : type === 'EXTERNAL' ? {
        type: {
            in: [
                'VENDOR',
                'CUSTOMER'
            ]
        }
    } : {};
    return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].location.findMany({
        where,
        orderBy: {
            name: 'asc'
        }
    });
}
async function getDashboardMetricsService() {
    const [pendingOps, products] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operation.count({
            where: {
                status: 'DRAFT'
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany()
    ]);
    const lowStockCount = products.filter((p)=>p.currentStock < p.minStock).length;
    const totalValue = 0;
    const totalProducts = products.length;
    return {
        pendingOps,
        lowStockCount,
        totalValue,
        totalProducts
    };
}
}),
"[project]/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0016c8120f9009f4a87b0d37e24b36dad80477c120":"getDashboardMetrics","401772c577b74bd4ab889c1cb11551e912e050bbcb":"getLocations","40207462081fcc84cc43cadd17ad95569a77ab2b5b":"createInboundOperation","40604df31221140e14e2c9468f445f65f27f5919af":"createOutboundOperation","40632b14e37277dcda8d38d3406f36974835ba43dd":"getProductStock","40837ef7ec831e073c38bca7d75b4f9cff0576ce16":"createProduct","40ad921f224ca355b12ef8953e4ee471470a1e280f":"getMoveHistory","40e000839fcd55f8dfe61a6ae04d68d3e4924fe9d9":"validateOperation","60dc17ef2862454028307249aa3abe22891acbf010":"createAdjustmentOperation"},"",""] */ __turbopack_context__.s([
    "createAdjustmentOperation",
    ()=>createAdjustmentOperation,
    "createInboundOperation",
    ()=>createInboundOperation,
    "createOutboundOperation",
    ()=>createOutboundOperation,
    "createProduct",
    ()=>createProduct,
    "getDashboardMetrics",
    ()=>getDashboardMetrics,
    "getLocations",
    ()=>getLocations,
    "getMoveHistory",
    ()=>getMoveHistory,
    "getProductStock",
    ()=>getProductStock,
    "validateOperation",
    ()=>validateOperation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/services.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function createProduct(formData) {
    const name = formData.get('name');
    const sku = formData.get('sku');
    const category = formData.get('category');
    const description = formData.get('description');
    const minStock = parseInt(formData.get('minStock')) || 0;
    if (!name || !sku || !category) {
        return {
            error: 'Missing required fields'
        };
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProductService"])({
            name,
            sku,
            category,
            description,
            minStock
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/stock');
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to create product:', error);
        return {
            error: error.message || 'Failed to create product'
        };
    }
}
async function getProductStock(productId) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductStockService"])(productId);
    } catch (error) {
        console.error('Failed to get product stock:', error);
        return 0;
    }
}
async function createInboundOperation(items) {
    try {
        const operation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createInboundOperationService"])(items);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/operations/receipts');
        return {
            success: true,
            operationId: operation.id
        };
    } catch (error) {
        console.error('Failed to create inbound operation:', error);
        return {
            error: error.message || 'Failed to create inbound operation'
        };
    }
}
async function createOutboundOperation(items) {
    try {
        const operation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createOutboundOperationService"])(items);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/operations/deliveries');
        return {
            success: true,
            operationId: operation.id
        };
    } catch (error) {
        console.error('Failed to create outbound operation:', error);
        return {
            error: error.message || 'Failed to create outbound operation'
        };
    }
}
async function createAdjustmentOperation(items, type) {
    try {
        const operation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdjustmentOperationService"])(items, type);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/operations/adjustment');
        return {
            success: true,
            operationId: operation.id
        };
    } catch (error) {
        console.error('Failed to create adjustment operation:', error);
        return {
            error: error.message || 'Failed to create adjustment operation'
        };
    }
}
async function validateOperation(operationId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateOperationService"])(operationId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/stock');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/operations');
        return {
            success: true
        };
    } catch (error) {
        console.error('Validation failed:', error);
        return {
            error: error.message || 'Validation failed'
        };
    }
}
async function getMoveHistory(productId) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMoveHistoryService"])(productId);
    } catch (error) {
        console.error('Failed to fetch move history:', error);
        return [];
    }
}
async function getLocations(type) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLocationsService"])(type);
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        return [];
    }
}
async function getDashboardMetrics() {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardMetricsService"])();
    } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
        return {
            pendingOps: 0,
            lowStockCount: 0,
            totalValue: 0,
            totalProducts: 0
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createProduct,
    getProductStock,
    createInboundOperation,
    createOutboundOperation,
    createAdjustmentOperation,
    validateOperation,
    getMoveHistory,
    getLocations,
    getDashboardMetrics
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProduct, "40837ef7ec831e073c38bca7d75b4f9cff0576ce16", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProductStock, "40632b14e37277dcda8d38d3406f36974835ba43dd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createInboundOperation, "40207462081fcc84cc43cadd17ad95569a77ab2b5b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOutboundOperation, "40604df31221140e14e2c9468f445f65f27f5919af", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdjustmentOperation, "60dc17ef2862454028307249aa3abe22891acbf010", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(validateOperation, "40e000839fcd55f8dfe61a6ae04d68d3e4924fe9d9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMoveHistory, "40ad921f224ca355b12ef8953e4ee471470a1e280f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLocations, "401772c577b74bd4ab889c1cb11551e912e050bbcb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDashboardMetrics, "0016c8120f9009f4a87b0d37e24b36dad80477c120", null);
}),
"[project]/.next-internal/server/app/settings/locations/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/lib/actions/auth-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/actions/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/settings/locations/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/lib/actions/auth-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "000e01556ed40dbc2a4f10777b9e7c673edf275859",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOutAction"],
    "0016c8120f9009f4a87b0d37e24b36dad80477c120",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardMetrics"],
    "401024374ad4e484a00123d87e1aaee226eb95a960",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["preAuthenticate"],
    "401772c577b74bd4ab889c1cb11551e912e050bbcb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLocations"],
    "40207462081fcc84cc43cadd17ad95569a77ab2b5b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createInboundOperation"],
    "40604df31221140e14e2c9468f445f65f27f5919af",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createOutboundOperation"],
    "40632b14e37277dcda8d38d3406f36974835ba43dd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductStock"],
    "40837ef7ec831e073c38bca7d75b4f9cff0576ce16",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProduct"],
    "40ad921f224ca355b12ef8953e4ee471470a1e280f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMoveHistory"],
    "40e000839fcd55f8dfe61a6ae04d68d3e4924fe9d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateOperation"],
    "6095436ed47bcbf1e0a77f7eb6a6084305dc033d5c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerUser"],
    "60be66a202d772940bea322562258910466041fa00",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authenticate"],
    "60dc17ef2862454028307249aa3abe22891acbf010",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdjustmentOperation"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$settings$2f$locations$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/settings/locations/page/actions.js { ACTIONS_MODULE0 => "[project]/app/lib/actions/auth-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/actions/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_38cef312._.js.map