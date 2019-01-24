import { geoPath } from "d3-geo";
import { select } from "d3-selection";
import React, { useEffect } from "react";
import { feature } from "topojson";
import us from "./us2.json";

const Map: React.FunctionComponent = () => {
    const mapRef = React.createRef<SVGSVGElement>();
    const path = geoPath();

    useEffect(() => {
        createMap();
    });

    const createMap = () => {
        const map = select(mapRef.current);

        map.selectAll("path")
            //@ts-ignore
            .data(feature(us, us.objects.states).features)
            .enter()
            .append("path")
            .attr("d", path as any);
    };

    return <svg ref={mapRef} width={1000} height={800} />;
};
export default Map;
