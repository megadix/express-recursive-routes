/**
 *
 * @param {Set} set1
 * @param {Set} set2
 * @return {boolean}
 */
module.exports.eqSet = function(set1, set2) {
    if (set1.size !== set2.size) return false;
    for (const a of set1) if (!set2.has(a)) return false;
    return true;
};