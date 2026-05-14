(() => {
  const MIN_SIZE = 18;

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function boundsOf(points) {
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return {
      minX,
      maxX,
      minY,
      maxY,
      w: Math.max(1, maxX - minX),
      h: Math.max(1, maxY - minY),
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2
    };
  }

  function pointLineDistance(point, start, end) {
    const lengthSq = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
    if (!lengthSq) return distance(point, start);
    const t = Math.max(0, Math.min(1, ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lengthSq));
    return distance(point, {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t
    });
  }

  function simplifyPoints(points, epsilon) {
    if (points.length < 3) return points;
    let maxDistance = 0;
    let index = 0;
    const end = points.length - 1;
    for (let i = 1; i < end; i += 1) {
      const currentDistance = pointLineDistance(points[i], points[0], points[end]);
      if (currentDistance > maxDistance) {
        index = i;
        maxDistance = currentDistance;
      }
    }
    if (maxDistance <= epsilon) return [points[0], points[end]];
    const left = simplifyPoints(points.slice(0, index + 1), epsilon);
    const right = simplifyPoints(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  }

  function smoothPoints(points) {
    if (points.length < 4) return points;
    return points.map((point, index) => {
      if (index === 0 || index === points.length - 1) return point;
      const prev = points[index - 1];
      const next = points[index + 1];
      return {
        x: Math.round((prev.x + point.x * 2 + next.x) / 4),
        y: Math.round((prev.y + point.y * 2 + next.y) / 4)
      };
    });
  }

  function pathLength(points) {
    return points.reduce((sum, point, index) => index ? sum + distance(points[index - 1], point) : 0, 0);
  }

  function shapeBounds(bounds, type) {
    return {
      type,
      x: Math.round(bounds.minX),
      y: Math.round(bounds.minY),
      w: Math.round(bounds.w),
      h: Math.round(bounds.h)
    };
  }

  function rectShape(bounds, forceSquare = false) {
    if (!forceSquare) return shapeBounds(bounds, "rectangle");
    const side = Math.max(bounds.w, bounds.h);
    return {
      type: "rectangle",
      x: Math.round(bounds.cx - side / 2),
      y: Math.round(bounds.cy - side / 2),
      w: Math.round(side),
      h: Math.round(side)
    };
  }

  function ellipseShape(bounds, forceCircle = false) {
    if (!forceCircle) return shapeBounds(bounds, "ellipse");
    const side = Math.max(bounds.w, bounds.h);
    return {
      type: "circle",
      x: Math.round(bounds.cx - side / 2),
      y: Math.round(bounds.cy - side / 2),
      w: Math.round(side),
      h: Math.round(side)
    };
  }

  function rectangleEdgeProfile(points, bounds, tolerance) {
    const counts = [0, 0, 0, 0];
    let edgeHits = 0;
    for (const point of points) {
      const onLeft = Math.abs(point.x - bounds.minX) <= tolerance;
      const onRight = Math.abs(point.x - bounds.maxX) <= tolerance;
      const onTop = Math.abs(point.y - bounds.minY) <= tolerance;
      const onBottom = Math.abs(point.y - bounds.maxY) <= tolerance;
      if (onLeft) counts[0] += 1;
      if (onRight) counts[1] += 1;
      if (onTop) counts[2] += 1;
      if (onBottom) counts[3] += 1;
      if (onLeft || onRight || onTop || onBottom) edgeHits += 1;
    }
    const sideThreshold = Math.max(2, points.length * 0.07);
    return {
      ratio: edgeHits / Math.max(1, points.length),
      sides: counts.filter((count) => count >= sideThreshold).length
    };
  }

  function normalizeClosedCorners(corners, maxDim) {
    if (corners.length < 4) return corners;
    const normalized = corners.slice();
    if (distance(normalized[0], normalized[normalized.length - 1]) < maxDim * 0.18) {
      normalized.pop();
    }
    return normalized;
  }

  function contextFrom(points) {
    const bounds = boundsOf(points);
    const maxDim = Math.max(bounds.w, bounds.h);
    const first = points[0];
    const last = points[points.length - 1];
    const length = Math.max(1, pathLength(points));
    const endpointDistance = distance(first, last);
    const closed = endpointDistance < maxDim * 0.28;
    const closedLoose = endpointDistance < maxDim * 0.46;
    const smoothed = smoothPoints(points);
    const simplifiedOpen = simplifyPoints(smoothed, Math.max(4, maxDim * 0.03));
    const openless = closedLoose ? points.slice(0, -1) : points;
    const simplifiedClosed = normalizeClosedCorners(simplifyPoints(openless, Math.max(8, maxDim * 0.055)), maxDim);
    return {
      points,
      bounds,
      maxDim,
      first,
      last,
      length,
      endpointDistance,
      closed,
      closedLoose,
      smoothed,
      simplifiedOpen,
      simplifiedClosed,
      corners: simplifiedClosed.length,
      aspect: bounds.w / bounds.h
    };
  }

  function recognizeLine(ctx) {
    const lineDeviation = ctx.points.reduce((max, point) => Math.max(max, pointLineDistance(point, ctx.first, ctx.last)), 0) / ctx.maxDim;
    const directness = ctx.endpointDistance / ctx.length;
    if (directness > 0.93 && lineDeviation < 0.075) {
      return { label: "直线", shape: null, straight: true };
    }
    return null;
  }

  function recognizeArrow(ctx) {
    const simplified = ctx.simplifiedOpen;
    if (ctx.closed || simplified.length < 4 || ctx.maxDim < 46) return null;

    for (let i = Math.max(1, simplified.length - 5); i < simplified.length - 1; i += 1) {
      const tip = simplified[i];
      const start = simplified[0];
      const shaft = distance(start, tip);
      if (shaft < ctx.maxDim * 0.5) continue;

      const after = simplified.slice(i + 1);
      const wingPoints = after.filter((point) => distance(point, tip) > ctx.maxDim * 0.08 && distance(point, tip) < ctx.maxDim * 0.42);
      const revisitsTip = after.some((point, index) => index && distance(point, tip) < ctx.maxDim * 0.13);
      const headEnough = wingPoints.length >= 1 && (revisitsTip || after.length >= 2);
      const tipRawIndex = ctx.points.findIndex((point, index) => index > 0 && distance(point, tip) < ctx.maxDim * 0.08);
      const shaftPoints = tipRawIndex > 1 ? ctx.points.slice(0, tipRawIndex + 1) : ctx.points.slice(0, Math.max(2, Math.floor(ctx.points.length * 0.6)));
      const shaftDeviation = shaftPoints
        .reduce((max, point) => Math.max(max, pointLineDistance(point, start, tip)), 0) / ctx.maxDim;
      if (headEnough && shaftDeviation < 0.18) {
        return {
          label: "箭头",
          shape: {
            type: "arrow",
            start: { x: Math.round(start.x), y: Math.round(start.y) },
            end: { x: Math.round(tip.x), y: Math.round(tip.y) },
            headSize: Math.round(Math.max(18, Math.min(42, shaft * 0.22)))
          },
          straight: false
        };
      }
    }
    return null;
  }

  function radialStats(ctx) {
    const rx = ctx.bounds.w / 2;
    const ry = ctx.bounds.h / 2;
    const radii = ctx.points.map((point) => Math.hypot((point.x - ctx.bounds.cx) / rx, (point.y - ctx.bounds.cy) / ry));
    const mean = radii.reduce((sum, value) => sum + value, 0) / radii.length;
    const variance = radii.reduce((sum, value) => sum + (value - mean) ** 2, 0) / radii.length;
    return { radii, mean, variation: Math.sqrt(variance) };
  }

  function recognizeRectangle(ctx) {
    const sparseCornerBox = ctx.points.length <= 16 && ctx.corners >= 4 && ctx.corners <= 6;
    if (!sparseCornerBox && radialStats(ctx).variation < 0.08) return null;
    const edgeProfile = rectangleEdgeProfile(ctx.points, ctx.bounds, Math.max(7, ctx.maxDim * 0.075));
    const strongBox = edgeProfile.ratio > 0.86;
    const corneredBox = ctx.corners >= 4 && ctx.corners <= 9 && edgeProfile.ratio > 0.68;
    const rectangleLike = (strongBox || corneredBox) && edgeProfile.sides === 4 && ctx.aspect > 0.46 && ctx.aspect < 2.25;
    if (!rectangleLike) return null;
    const isSquare = ctx.aspect > 0.82 && ctx.aspect < 1.18;
    return {
      label: isSquare ? "正方形" : "矩形",
      shape: rectShape(ctx.bounds, isSquare),
      straight: false
    };
  }

  function recognizeEllipse(ctx, radial) {
    if (radial.variation > 0.23 || ctx.corners <= 5) return null;
    const isCircle = ctx.aspect > 0.82 && ctx.aspect < 1.18;
    return {
      label: isCircle ? "正圆形" : "椭圆形",
      shape: ellipseShape(ctx.bounds, isCircle),
      straight: false
    };
  }

  function recognizeTriangle(ctx) {
    if (ctx.corners !== 3 || ctx.aspect < 0.32 || ctx.aspect > 2.6) return null;
    const radial = radialStats(ctx);
    if (radial.variation < 0.035) return null;
    return { label: "三角形", shape: shapeBounds(ctx.bounds, "triangle"), straight: false };
  }

  function recognizeHeart(ctx) {
    const { bounds, points, aspect } = ctx;
    if (aspect < 0.62 || aspect > 1.48 || ctx.maxDim < 38) return null;
    if (radialStats(ctx).variation < 0.055) return null;

    const bottom = points.reduce((best, point) => point.y > best.y ? point : best, points[0]);
    const bottomCentered = Math.abs(bottom.x - bounds.cx) < bounds.w * 0.28;
    const heartPoints = points.concat(ctx.simplifiedClosed);
    const leftLobe = heartPoints.filter((point) => point.x < bounds.cx - bounds.w * 0.16 && point.y < bounds.cy);
    const rightLobe = heartPoints.filter((point) => point.x > bounds.cx + bounds.w * 0.16 && point.y < bounds.cy);
    const middleTop = heartPoints.filter((point) => Math.abs(point.x - bounds.cx) < bounds.w * 0.24 && point.y < bounds.cy);
    if (!bottomCentered || leftLobe.length < 2 || rightLobe.length < 2 || middleTop.length < 1) return null;

    const leftTop = Math.min(...leftLobe.map((point) => point.y));
    const rightTop = Math.min(...rightLobe.map((point) => point.y));
    const middleNotchY = Math.max(...middleTop.map((point) => point.y));
    const topNotch = middleNotchY > Math.min(leftTop, rightTop) + bounds.h * 0.14;
    const pointyBottom = points.filter((point) => point.y > bounds.maxY - bounds.h * 0.13).length < points.length * 0.24;
    const endpointNearBottom = ctx.first.y > bounds.cy && ctx.last.y > bounds.cy;
    const classicHeart = topNotch && pointyBottom;

    const top = heartPoints.reduce((best, point) => point.y < best.y ? point : best, heartPoints[0]);
    const topCentered = Math.abs(top.x - bounds.cx) < bounds.w * 0.24;
    const shoulderMinY = bounds.minY + bounds.h * 0.16;
    const shoulderMaxY = bounds.minY + bounds.h * 0.56;
    const leftShoulder = heartPoints.filter((point) => point.x < bounds.cx - bounds.w * 0.2 && point.y > shoulderMinY && point.y < shoulderMaxY);
    const rightShoulder = heartPoints.filter((point) => point.x > bounds.cx + bounds.w * 0.2 && point.y > shoulderMinY && point.y < shoulderMaxY);
    const shoulderY = Math.min(
      leftShoulder.length ? Math.min(...leftShoulder.map((point) => point.y)) : bounds.maxY,
      rightShoulder.length ? Math.min(...rightShoulder.map((point) => point.y)) : bounds.maxY
    );
    const pointedTopHeart = topCentered
      && pointyBottom
      && leftShoulder.length >= 2
      && rightShoulder.length >= 2
      && shoulderY > top.y + bounds.h * 0.12;

    if ((!classicHeart && !pointedTopHeart) || (!ctx.closedLoose && !endpointNearBottom)) return null;
    return { label: "爱心", shape: shapeBounds(bounds, "heart"), straight: false };
  }

  function countRadialPeaks(ctx) {
    const center = { x: ctx.bounds.cx, y: ctx.bounds.cy };
    const simplified = ctx.simplifiedClosed;
    const distances = simplified.map((point) => distance(point, center));
    const mean = distances.reduce((sum, value) => sum + value, 0) / distances.length;
    let peaks = 0;
    for (let i = 0; i < distances.length; i += 1) {
      const prev = distances[(i - 1 + distances.length) % distances.length];
      const next = distances[(i + 1) % distances.length];
      if (distances[i] > prev && distances[i] > next && distances[i] > mean * 1.08) peaks += 1;
    }
    return peaks;
  }

  function segmentIntersection(a, b, c, d) {
    const cross = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    const ab1 = cross(a, b, c);
    const ab2 = cross(a, b, d);
    const cd1 = cross(c, d, a);
    const cd2 = cross(c, d, b);
    return ab1 * ab2 < 0 && cd1 * cd2 < 0;
  }

  function countSelfIntersections(points) {
    let count = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      for (let j = i + 2; j < points.length - 1; j += 1) {
        if (i === 0 && j === points.length - 2) continue;
        if (segmentIntersection(points[i], points[i + 1], points[j], points[j + 1])) count += 1;
      }
    }
    return count;
  }

  function recognizePentagram(ctx) {
    const simplified = ctx.simplifiedClosed;
    if (simplified.length < 5 || simplified.length > 9) return null;
    const intersections = countSelfIntersections(simplified.concat([simplified[0]]));
    if (intersections < 3) return null;
    return { label: "五角星", shape: shapeBounds(ctx.bounds, "star"), straight: false };
  }

  function recognizeStar(ctx, radial) {
    const pentagram = recognizePentagram(ctx);
    if (pentagram) return pentagram;
    if (ctx.corners < 7 || ctx.corners > 14 || radial.variation < 0.12) return null;
    const peaks = countRadialPeaks(ctx);
    if (peaks < 4 || peaks > 6) return null;
    return { label: "五角星", shape: shapeBounds(ctx.bounds, "star"), straight: false };
  }

  function recognizePentagon(ctx) {
    if (ctx.corners < 5 || ctx.corners > 6) return null;
    return { label: "五边形", shape: shapeBounds(ctx.bounds, "pentagon"), straight: false };
  }

  function fallbackOpenStroke(ctx) {
    const simplified = ctx.simplifiedOpen;
    if (simplified.length < ctx.points.length * 0.82) {
      return { label: "折线", shape: null, straight: false, points: simplified };
    }
    return { label: "平滑线", shape: null, straight: false, points: ctx.smoothed };
  }

  function recognizeStroke(points) {
    if (points.length < 2) return null;
    const ctx = contextFrom(points);
    if (ctx.maxDim < MIN_SIZE) return null;

    if (!ctx.closedLoose) {
      return recognizeArrow(ctx) || recognizeLine(ctx) || fallbackOpenStroke(ctx);
    }

    const radial = radialStats(ctx);
    return recognizeHeart(ctx)
      || recognizeStar(ctx, radial)
      || recognizeTriangle(ctx)
      || recognizeRectangle(ctx)
      || recognizeEllipse(ctx, radial)
      || recognizePentagon(ctx);
  }

  window.ShapeRecognizer = { recognizeStroke };
})();
