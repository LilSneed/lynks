"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function D3test({ clusterData }) {
  const [data, setData] = useState([clusterData]);
  console.log(data);
  const getData = async (id, url) => {
    const request = await fetch(
      `http://localhost:3000/api/getClusterData?id=${id}&url=${url}`
    );
    const data = await request.json();
    return data;
  };

  const svgRef = useRef();
  const width = 928;
  const height = 600;

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const visitedClusters = new Set();

    const prepareLinks = (cluster) => {
      const links = [];

      if (cluster.relatedClusters && cluster.relatedClusters.length > 0) {
        links.push(
          ...cluster.relatedClusters.map((relatedCluster) => ({
            source: cluster.title,
            target: relatedCluster.title,
            value: 1,
          }))
        );

        cluster.relatedClusters.forEach((relatedCluster) => {
          links.push(...prepareLinks(relatedCluster));
        });
      }

      return links;
    };

    const links = data.reduce((acc, cluster) => {
      return acc.concat(prepareLinks(cluster));
    }, []);

    const prepareNodes = (cluster, groupId) => {
      if (visitedClusters.has(cluster.id)) {
        return [];
      }

      visitedClusters.add(cluster.id);

      const nodes = [
        {
          id: cluster.title,
          group: groupId,
          radius: cluster.relatedClusters ? cluster.relatedClusters.length : 0,
          clusterId: cluster.id,
          url: cluster.url,
          lynks: cluster.lynks, // Add the lynk data here
        },
      ];

      if (cluster.relatedClusters && cluster.relatedClusters.length > 0) {
        cluster.relatedClusters.forEach((relatedCluster, index) => {
          nodes.push(...prepareNodes(relatedCluster, groupId + index + 2));
        });
      }

      return nodes;
    };

    const nodes = data.reduce((acc, cluster, index) => {
      return acc.concat(prepareNodes(cluster, index + 1));
    }, []);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-2000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(nodes)
      .join("g");

    node
      .append("circle")
      .attr("r", (d) => d.radius * 5 + 5)
      .attr("fill", (d) => color(d.group));

    node
      .append("text")
      .attr("dx", (d) => -30)
      .text((d) => d.id);

    node.append("title").text((d) => d.id);

    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
    const lynk = node
      .selectAll("g")
      .data((d) => d.lynks || [])
      .join("g");

    lynk.append("circle").attr("r", 5).attr("fill", "white");

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node
        .selectAll("text")
        .attr("x", (d) => d.x)
        .attr("font-size", (d) => d.radius * 2 + 10 + "px")
        .attr("font-weight", 25)
        .attr("fill", "white")
        .attr("y", (d) => d.y + d.radius + 10 * 2);
      node
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
      node
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
      node
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
      node
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .on("click", (event, d) => {
          window.location.href = d.url;
        });

      lynk.attr("transform", (d, i, nodes) => {
        const parent = d3.select(nodes[i].parentNode).datum();
        const angle = (i / parent.lynks.length) * Math.PI * 2;
        const x = parent.x + Math.cos(angle) * (parent.radius * 5 + 20);
        const y = parent.y + Math.sin(angle) * (parent.radius * 5 + 20);
        return `translate(${x},${y})`;
      });

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      // Cleanup code (optional) - This will be executed when the component unmounts.
      simulation.stop();
    };
  }, [data]); // Empty dependency array ensures the effect runs only once after initial render

  return <svg ref={svgRef}></svg>;
}
