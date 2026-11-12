import { relations } from 'drizzle-orm';
import {
	boolean,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import type { PanoramaConfig } from '#lib/types/panorama.ts';

export const contentStatus = pgEnum('content_status', ['draft', 'published']);
export const hotspotType = pgEnum('hotspot_type', ['navigation', 'information', 'external']);
export const processingStatus = pgEnum('processing_status', ['uploaded', 'processed', 'failed']);
export const contentLocale = pgEnum('content_locale', ['id', 'en']);

export const panoramaAsset = pgTable('panorama_asset', {
	id: uuid('id').primaryKey().defaultRandom(),
	originalPath: text('original_path').notNull(),
	tileBasePath: text('tile_base_path'),
	thumbnailPath: text('thumbnail_path').notNull(),
	previewPath: text('preview_path'),
	projection: varchar('projection', { length: 32 }).notNull().default('equirectangular'),
	width: integer('width').notNull(),
	height: integer('height'),
	config: jsonb('config').$type<PanoramaConfig>(),
	processingStatus: processingStatus('processing_status').notNull().default('uploaded'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const area = pgTable('area', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: varchar('slug', { length: 120 }).notNull().unique(),
	status: contentStatus('status').notNull().default('draft'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const areaTranslation = pgTable(
	'area_translation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		areaId: uuid('area_id')
			.notNull()
			.references(() => area.id, { onDelete: 'cascade' }),
		locale: contentLocale('locale').notNull(),
		title: varchar('title', { length: 200 }).notNull(),
		description: text('description').notNull()
	},
	(table) => ({
		areaLocaleUnique: uniqueIndex('area_translation_area_locale_unique').on(
			table.areaId,
			table.locale
		)
	})
);

export const scene = pgTable(
	'scene',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: varchar('slug', { length: 120 }).notNull().unique(),
		panoramaAssetId: uuid('panorama_asset_id').references(() => panoramaAsset.id, {
			onDelete: 'restrict'
		}),
		areaId: uuid('area_id').references(() => area.id, { onDelete: 'set null' }),
		initialYaw: doublePrecision('initial_yaw').notNull().default(0),
		initialPitch: doublePrecision('initial_pitch').notNull().default(0),
		initialFov: doublePrecision('initial_fov')
			.notNull()
			.default(Math.PI / 2),
		sortOrder: integer('sort_order').notNull().default(0),
		status: contentStatus('status').notNull().default('draft'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => ({
		statusIdx: index('scene_status_idx').on(table.status),
		sortOrderIdx: index('scene_sort_order_idx').on(table.sortOrder)
	})
);

export const sceneTranslation = pgTable(
	'scene_translation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		sceneId: uuid('scene_id')
			.notNull()
			.references(() => scene.id, { onDelete: 'cascade' }),
		locale: contentLocale('locale').notNull(),
		title: varchar('title', { length: 200 }).notNull(),
		description: text('description').notNull()
	},
	(table) => ({
		sceneLocaleUnique: uniqueIndex('scene_translation_scene_locale_unique').on(
			table.sceneId,
			table.locale
		)
	})
);

export const hotspot = pgTable(
	'hotspot',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		sceneId: uuid('scene_id')
			.notNull()
			.references(() => scene.id, { onDelete: 'cascade' }),
		targetSceneId: uuid('target_scene_id').references(() => scene.id, {
			onDelete: 'restrict'
		}),
		type: hotspotType('type').notNull(),
		yaw: doublePrecision('yaw').notNull(),
		pitch: doublePrecision('pitch').notNull(),
		icon: varchar('icon', { length: 64 }),
		sortOrder: integer('sort_order').notNull().default(0),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => ({
		sceneIdx: index('hotspot_scene_idx').on(table.sceneId),
		targetSceneIdx: index('hotspot_target_scene_idx').on(table.targetSceneId)
	})
);

export const hotspotTranslation = pgTable(
	'hotspot_translation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		hotspotId: uuid('hotspot_id')
			.notNull()
			.references(() => hotspot.id, { onDelete: 'cascade' }),
		locale: contentLocale('locale').notNull(),
		label: varchar('label', { length: 200 }).notNull(),
		title: varchar('title', { length: 200 }).notNull(),
		description: text('description').notNull(),
		externalUrl: text('external_url')
	},
	(table) => ({
		hotspotLocaleUnique: uniqueIndex('hotspot_translation_hotspot_locale_unique').on(
			table.hotspotId,
			table.locale
		)
	})
);

export const siteContent = pgTable('site_content', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: varchar('slug', { length: 80 }).notNull().unique(),
	status: contentStatus('status').notNull().default('draft'),
	managerName: varchar('manager_name', { length: 200 }).notNull().default(''),
	managerUrl: text('manager_url').notNull().default(''),
	mapUrl: text('map_url').notNull().default(''),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const siteContentTranslation = pgTable(
	'site_content_translation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		contentId: uuid('content_id')
			.notNull()
			.references(() => siteContent.id, { onDelete: 'cascade' }),
		locale: contentLocale('locale').notNull(),
		heritageLabel: varchar('heritage_label', { length: 120 }).notNull().default(''),
		location: text('location').notNull().default(''),
		visitingHours: text('visiting_hours').notNull().default(''),
		access: text('access').notNull().default(''),
		dressCode: text('dress_code').notNull().default(''),
		photoPolicy: text('photo_policy').notNull().default(''),
		etiquette: text('etiquette').notNull().default(''),
		contact: text('contact').notNull().default(''),
		verificationNote: varchar('verification_note', { length: 300 }).notNull().default('')
	},
	(table) => ({
		contentLocaleUnique: uniqueIndex('site_content_translation_content_locale_unique').on(
			table.contentId,
			table.locale
		)
	})
);

export const sitePage = pgTable('site_page', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: varchar('slug', { length: 80 }).notNull().unique(),
	status: contentStatus('status').notNull().default('draft'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const sitePageTranslation = pgTable(
	'site_page_translation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		pageId: uuid('page_id')
			.notNull()
			.references(() => sitePage.id, { onDelete: 'cascade' }),
		locale: contentLocale('locale').notNull(),
		eyebrow: varchar('eyebrow', { length: 200 }).notNull().default(''),
		title: varchar('title', { length: 300 }).notNull().default(''),
		description: text('description').notNull().default(''),
		verificationNote: varchar('verification_note', { length: 500 }).notNull().default('')
	},
	(table) => ({
		pageLocaleUnique: uniqueIndex('site_page_translation_page_locale_unique').on(
			table.pageId,
			table.locale
		)
	})
);

export const sitePageBlock = pgTable(
	'site_page_block',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		pageId: uuid('page_id')
			.notNull()
			.references(() => sitePage.id, { onDelete: 'cascade' }),
		type: varchar('type', { length: 32 }).notNull().default('section'),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => ({
		pageOrderIdx: index('site_page_block_page_order_idx').on(table.pageId, table.sortOrder)
	})
);

export const sitePageBlockTranslation = pgTable(
	'site_page_block_translation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		blockId: uuid('block_id')
			.notNull()
			.references(() => sitePageBlock.id, { onDelete: 'cascade' }),
		locale: contentLocale('locale').notNull(),
		heading: varchar('heading', { length: 300 }).notNull().default(''),
		body: text('body').notNull().default('')
	},
	(table) => ({
		blockLocaleUnique: uniqueIndex('site_page_block_translation_block_locale_unique').on(
			table.blockId,
			table.locale
		)
	})
);

export const panoramaAssetRelations = relations(panoramaAsset, ({ many }) => ({
	scenes: many(scene)
}));

export const areaRelations = relations(area, ({ many }) => ({
	translations: many(areaTranslation),
	scenes: many(scene)
}));

export const areaTranslationRelations = relations(areaTranslation, ({ one }) => ({
	area: one(area, {
		fields: [areaTranslation.areaId],
		references: [area.id]
	})
}));

export const sceneRelations = relations(scene, ({ one, many }) => ({
	panoramaAsset: one(panoramaAsset, {
		fields: [scene.panoramaAssetId],
		references: [panoramaAsset.id]
	}),
	area: one(area, {
		fields: [scene.areaId],
		references: [area.id]
	}),
	translations: many(sceneTranslation),
	hotspots: many(hotspot, { relationName: 'sceneHotspots' }),
	targetedBy: many(hotspot, { relationName: 'targetSceneHotspots' })
}));

export const sceneTranslationRelations = relations(sceneTranslation, ({ one }) => ({
	scene: one(scene, {
		fields: [sceneTranslation.sceneId],
		references: [scene.id]
	})
}));

export const hotspotRelations = relations(hotspot, ({ one, many }) => ({
	scene: one(scene, {
		fields: [hotspot.sceneId],
		references: [scene.id],
		relationName: 'sceneHotspots'
	}),
	targetScene: one(scene, {
		fields: [hotspot.targetSceneId],
		references: [scene.id],
		relationName: 'targetSceneHotspots'
	}),
	translations: many(hotspotTranslation)
}));

export const hotspotTranslationRelations = relations(hotspotTranslation, ({ one }) => ({
	hotspot: one(hotspot, {
		fields: [hotspotTranslation.hotspotId],
		references: [hotspot.id]
	})
}));

export const siteContentRelations = relations(siteContent, ({ many }) => ({
	translations: many(siteContentTranslation)
}));

export const siteContentTranslationRelations = relations(siteContentTranslation, ({ one }) => ({
	content: one(siteContent, {
		fields: [siteContentTranslation.contentId],
		references: [siteContent.id]
	})
}));

export const sitePageRelations = relations(sitePage, ({ many }) => ({
	translations: many(sitePageTranslation),
	blocks: many(sitePageBlock)
}));

export const sitePageTranslationRelations = relations(sitePageTranslation, ({ one }) => ({
	page: one(sitePage, {
		fields: [sitePageTranslation.pageId],
		references: [sitePage.id]
	})
}));

export const sitePageBlockRelations = relations(sitePageBlock, ({ one, many }) => ({
	page: one(sitePage, {
		fields: [sitePageBlock.pageId],
		references: [sitePage.id]
	}),
	translations: many(sitePageBlockTranslation)
}));

export const sitePageBlockTranslationRelations = relations(sitePageBlockTranslation, ({ one }) => ({
	block: one(sitePageBlock, {
		fields: [sitePageBlockTranslation.blockId],
		references: [sitePageBlock.id]
	})
}));
