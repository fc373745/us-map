import { geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import React, { useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { feature, mesh } from "topojson";
import us from "./us2.json";

const GlobalStyle = createGlobalStyle`
    .states {
        stroke: #373745;
        fill: #373745;
        &:hover {
            fill: black;
            transition-duration: 450ms;
        }
    }

    .state-borders {
        fill: none;
        stroke: white;
        stroke-width: 2px;
        stroke-linejoin: round;
        stroke-linecap: round;
        pointer-events: none;
    }

    .state-borders {
        stroke-dasharray:1000;
        stroke-dashoffset: 1000;
        animation: dash 3s linear forwards;
    }
    @keyframes dash {
        to {
            stroke-dashoffset: 0;
        }
    }
`;

const Map: React.FunctionComponent = () => {
    const mapRef = React.createRef<SVGSVGElement>();
    const path = geoPath();
    let centered: any = null;

    useEffect(() => {
        createMap();
    }, []);

    const createMap = () => {
        const map = select(mapRef.current);

        map.selectAll("path")
            //@ts-ignore
            .data(feature(us, us.objects.states).features)
            .enter()
            .append("path")
            .attr("class", "states")
            .attr("d", path as any)
            .on("click", clicked);
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

    const clicked = (d: any) => {
        const map = select(mapRef.current);
        var x, y, k;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
        } else {
            x = 500;
            y = 400;
            k = 1;
            centered = null;
        }

        map.selectAll("path").classed(
            "active",
            centered &&
                function(d: any) {
                    return d === centered;
                }
        );
        map.transition()
            .duration(750)
            // .attr("transform", `translate(${x}, ${y})`)
            .attr("transform", `scale(2.5)translate(${500 - x}, ${400 - y})`)
            .style("stroke-width", 1.5 / k + "px");
    };

    return (
        <React.Fragment>
            <svg ref={mapRef} width={1000} height={800}>
                <GlobalStyle />
            </svg>
        </React.Fragment>
    );
};
export default Map;
