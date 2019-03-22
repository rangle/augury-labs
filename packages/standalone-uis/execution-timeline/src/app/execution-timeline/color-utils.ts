/* tslint:disable:no-bitwise */

export function blendColors(c0, c1, p) {
  const f = parseInt(c0.slice(1), 16);
  const t = parseInt(c1.slice(1), 16);
  const R1 = f >> 16;
  const G1 = (f >> 8) & 0x00ff;
  const B1 = f & 0x0000ff;
  const R2 = t >> 16;
  const G2 = (t >> 8) & 0x00ff;
  const B2 = t & 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((R2 - R1) * p) + R1) * 0x10000 +
      (Math.round((G2 - G1) * p) + G1) * 0x100 +
      (Math.round((B2 - B1) * p) + B1)
    )
      .toString(16)
      .slice(1)
  );
}

export function lightenColor(c, p) {
  return blendColors(c, '#FFFFFF', p);
}

export function darkenColor(c, p) {
  return blendColors(c, '#000000', p);
}
