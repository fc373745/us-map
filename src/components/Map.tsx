import { geoPath } from "d3-geo";
import { select } from "d3-selection";
import React, { useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { feature, mesh } from "topojson";
import us from "./us2.json";

const GlobalStyle = createGlobalStyle`
    .states {
        fill: #373745;
        &:hover {
            fill: black;
            transition-duration: 450ms;
        }
    }

    .state-borders {
        fill: none;
        stroke: white;
        stroke-width: 1px;
        stroke-linejoin: round;
        stroke-linecap: round;
        pointer-events: none;
    }
`;

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
            .attr("class", "states")
            .attr("d", path as any);
        map.append("path")
            .attr(
                "d",
                //@ts-ignore
                path(
                    //@ts-ignore
                    mesh(us, us.objects.states, function(a, b) {
                        return a !== b;
                    })
                )
            )
            .attr("class", "state-borders");
    };

    return (
        <React.Fragment>
            <svg ref={mapRef} width={1000} height={800}>
                <GlobalStyle />
            </svg>
            ;
        </React.Fragment>
    );
};
export default Map;
