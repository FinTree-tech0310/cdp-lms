"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectUnseenItem = selectUnseenItem;
exports.updateSeenItemIds = updateSeenItemIds;
function selectUnseenItem(items, seenIds, emptyPoolMessage) {
    if (items.length === 0)
        throw new Error(emptyPoolMessage);
    const unseenItems = items.filter((item) => !seenIds.includes(item.id));
    const lastSeenId = seenIds.at(-1);
    const nextCycleItems = items.filter((item) => item.id !== lastSeenId);
    const candidates = unseenItems.length > 0
        ? unseenItems
        : nextCycleItems.length > 0
            ? nextCycleItems
            : items;
    return candidates[Math.floor(Math.random() * candidates.length)];
}
function updateSeenItemIds(seenIds, selectedId, itemCount) {
    const uniqueSeenIds = [...new Set(seenIds)];
    const cycleHistory = uniqueSeenIds.length >= itemCount ? [] : uniqueSeenIds;
    const withoutSelected = cycleHistory.filter((id) => id !== selectedId);
    return [...withoutSelected, selectedId].slice(-Math.max(1, itemCount));
}
