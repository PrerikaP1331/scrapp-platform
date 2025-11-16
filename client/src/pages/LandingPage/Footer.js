import React, { useEffect, useRef } from "react";
import { IconRecycle, IconBrandGithub, IconMail, IconBrandTwitter, IconBrandInstagram } from "@tabler/icons-react";

const Footer = () => {
  const footerTreesRef = useRef(null);
  const currentYear = new Date().getFullYear();

  const palette = {
    linen: '#dad7cd',
    sage: '#a3b18a',
    fern: '#588157',
    pine: '#3a5a40',
    forest: '#344e41',
  };

  function generateTrees(container) {
    if (!container) return;
    container.innerHTML = "";

    const tree1 = `<svg class="tree" viewBox="15 -40 20 40">
      <path class="trunk" d="m25,5 l-1,32 a2,2 0 0,0 2,0 l-1,-32"/>
      <path d="m25,5 a10,10 0 0 1 -2,6" class="left"/>
      <path d="m25,8 a5,5 0 0 1 -2,3" class="left"/>
      <path d="m25,5 a15,15 0 0 0 3,9" class="right"/>
      <path d="m25,10 a6,6 0 0 0 2,3.5" class="right"/>
      <path d="m25,8 a8,8 0 0 1 -4,8" class="left"/>
      <path d="m25,10 a6,6 0 0 1 -3,6" class="left"/>
      <path d="m25,11 a9,9 0 0 0 6,8" class="right"/>
      <path d="m25,13 a8,8 0 0 0 5,6.5" class="right"/>
      <path d="m25,16 a8,8 0 0 0 3,3.5" class="right"/>
      <path d="m25,12 a9,9 0 0 1 -6,9" class="left"/>
      <path d="m25,14 a8,8 0 0 1 -5,7.5" class="left"/>
      <path d="m25,15 a7,7 0 0 1 -3,6.5" class="left"/>
      <path d="m25,22 a10,10 0 0 0 8,5" class="right"/>
      <path d="m25,23 a9,9 0 0 0 7,4.5" class="right"/>
      <path d="m25,24 a8,8 0 0 0 4,3.5" class="right"/>
      <path d="m25,18 a8,8 0 0 1 -6,8" class="left"/>
      <path d="m25,22 a7,7 0 0 1 -4,4" class="left"/>
      <path d="m25,18 a6,6 0 0 0 6,5" class="right"/>
      <path d="m25,20 a7,7 0 0 0 3,3" class="right"/>
      <path d="m25,23.5 a7,7 0 0 1 -8,5" class="left"/>
      <path d="m25,25.5 a8,8 0 0 1 -6,4" class="left"/>
      <path d="m25,27 a8,8 0 0 1 -3,2.5" class="left"/>
      <path d="m25,27 a9,9 0 0 0 9,4" class="right"/>
      <path d="m25,28 a9,9 0 0 0 8,4" class="right"/>
      <path d="m25,29 a10,10 0 0 0 6,3.5" class="right"/>
      <path d="m25,30 a7,7 0 0 0 3,2.5" class="right"/>
      <path d="m25,29 a9,9 0 0 1 -9,4" class="left"/>
      <path d="m25,30 a9,9 0 0 1 -8,4" class="left"/>
      <path d="m25,31 a10,10 0 0 1 -6,3.5" class="left"/>
      <path d="m25,32 a7,7 0 0 1 -3,2.5" class="left"/>
    </svg>`;

    const tree2 = `<svg class="tree" viewBox="15 -40 20 40">
      <path class="trunk" d="m25,22 l-0.5,15 a1,1 0 0,0 1,0 l-0.5,-15"/>
      <path d="m25,18 a10,10 0 0 1 -2,6" class="left"/>
      <path d="m25,21 a5,5 0 0 1 -2,3" class="left"/>
      <path d="m25,18 a15,15 0 0 0 3,9" class="right"/>
      <path d="m25,23 a6,6 0 0 0 2,3.5" class="right"/>
      <path d="m25,21 a8,8 0 0 1 -4,8" class="left"/>
      <path d="m25,23 a6,6 0 0 1 -3,6" class="left"/>
      <path d="m25,24 a9,9 0 0 0 6,8" class="right"/>
      <path d="m25,26 a8,8 0 0 0 5,6.5" class="right"/>
      <path d="m25,29 a8,8 0 0 0 3,3.5" class="right"/>
      <path d="m25,25 a9,9 0 0 1 -6,9" class="left"/>
      <path d="m25,27 a8,8 0 0 1 -5,7.5" class="left"/>
      <path d="m25,28 a7,7 0 0 1 -3,6.5" class="left"/>
    </svg>`;

    const treeCount = 18;
    for (let i = 0; i < treeCount; i++) {
      const html = Math.random() > 0.25 ? tree1 : tree2;
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      const svg = wrap.firstChild;

      const rand = Math.random();
      const height = (rand * 60) + 20;
      const left = (Math.random() * 110) - 5;

      const steps = 5;
      const scale = Math.round((height - 20) / 60 * (steps - 1));
      const bgR = 255, bgG = 255, bgB = 255;
      const fgR = 88, fgG = 129, fgB = 87;
      const r = Math.round(bgR + ((fgR - bgR) / steps * (scale + 1)));
      const g = Math.round(bgG + ((fgG - bgG) / steps * (scale + 1)));
      const b = Math.round(bgB + ((fgB - bgB) / steps * (scale + 1)));

      svg.style.height = `${height}%`;
      svg.style.left = `${left}%`;
      svg.style.zIndex = Math.round(height);
      svg.style.stroke = `rgb(${r}, ${g}, ${b})`;

      if (Math.random() > 0.5) svg.style.transform = "scaleX(-1)";

      const trunk = svg.querySelector(".trunk");
      if (trunk) trunk.style.fill = `rgb(${r}, ${g}, ${b})`;

      container.appendChild(svg);
    }

    const svgs = container.querySelectorAll(".tree");
    svgs.forEach((treeSvg) => animateTreeCycle(treeSvg, Math.round(Math.random() * 1200)));

    const trunks = container.querySelectorAll(".trunk");
    trunks.forEach(t => {
      t.style.cursor = "pointer";
      t.addEventListener("mouseenter", () => shakeTree(t));
    });

    function animateTreeCycle(treeSvg, delay = 0) {
      const branches = treeSvg.querySelectorAll("path:not(.trunk)");
      const trunk = treeSvg.querySelector(".trunk");
      const leftBranches = treeSvg.querySelectorAll("path.left");
      const rightBranches = treeSvg.querySelectorAll("path.right");

      setTimeout(() => {
        trunk.style.opacity = "0";
        branches.forEach(branch => {
          const len = branch.getTotalLength ? branch.getTotalLength() : 0;
          branch.style.strokeDasharray = len;
          branch.style.strokeDashoffset = len;
          branch.style.opacity = "0";
        });

        leftBranches.forEach(branch => {
          branch.style.transformOrigin = "top right";
          branch.style.transform = "rotate(-18deg)";
        });
        rightBranches.forEach(branch => {
          branch.style.transformOrigin = "top left";
          branch.style.transform = "rotate(18deg)";
        });

        setTimeout(() => {
          trunk.style.transition = "opacity 0.65s ease-out";
          trunk.style.opacity = "1";

          treeSvg.style.transition = "all 0.65s cubic-bezier(0.175,0.885,0.32,1.275)";
          treeSvg.setAttribute("viewBox", "15 -3 20 40");

          branches.forEach((branch, i) => {
            setTimeout(() => {
              branch.style.transition = "stroke-dashoffset 0.45s ease-out, transform 1.8s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.7s ease-out";
              branch.style.strokeDashoffset = "0";
              branch.style.transform = "rotate(0deg)";
              branch.style.opacity = "1";
            }, i * 25);
          });

          setTimeout(() => {
            trunk.style.transition = "opacity 1.0s ease-out";
            trunk.style.opacity = "0";

            branches.forEach((branch, i) => {
              setTimeout(() => {
                branch.style.transition = "opacity 0.8s ease-out";
                branch.style.opacity = "0";
              }, i * 16);
            });

            setTimeout(() => {
              treeSvg.setAttribute("viewBox", "15 -40 20 40");
              randomizeTreePlacement(treeSvg);
              animateTreeCycle(treeSvg, Math.round(800 + Math.random() * 2000));
            }, 900);
          }, 900);
        }, 80);
      }, delay);
    }

    function randomizeTreePlacement(treeSvg) {
      const rand = Math.random();
      const height = rand * 60 + 20;
      const left = Math.random() * 110 - 5;
      const steps = 5;
      const bgR = 218, bgG = 215, bgB = 205;
      const fgR = 88, fgG = 129, fgB = 87;
      const r = Math.round(bgR + ((fgR - bgR) / steps * (3 + Math.random())));
      const g = Math.round(bgG + ((fgG - bgG) / steps * (3 + Math.random())));
      const b = Math.round(bgB + ((fgB - bgB) / steps * (3 + Math.random())));
      treeSvg.style.height = `${height}%`;
      treeSvg.style.left = `${left}%`;
      treeSvg.style.zIndex = Math.round(height);
      treeSvg.style.stroke = `rgb(${r}, ${g}, ${b})`;
      if (Math.random() > 0.5) treeSvg.style.transform = "scaleX(-1)"; else treeSvg.style.transform = "none";
      const trunk = treeSvg.querySelector(".trunk");
      if (trunk) trunk.style.fill = `rgb(${r}, ${g}, ${b})`;
    }

    function shakeTree(trunk) {
      const tree = trunk.closest(".tree");
      if (!tree) return;
      const leftBranches = tree.querySelectorAll("path.left");
      const rightBranches = tree.querySelectorAll("path.right");

      leftBranches.forEach((branch, i) => {
        setTimeout(() => {
          const curr = branch.style.transform;
          branch.style.transition = "transform 0.08s ease-out";
          branch.style.transform = "rotate(-4deg)";
          setTimeout(() => {
            branch.style.transition = "transform 1.6s cubic-bezier(0.175,0.885,0.32,1.275)";
            branch.style.transform = curr;
          }, 90);
        }, i * 22);
      });

      rightBranches.forEach((branch, i) => {
        setTimeout(() => {
          const curr = branch.style.transform;
          branch.style.transition = "transform 0.08s ease-out";
          branch.style.transform = "rotate(4deg)";
          setTimeout(() => {
            branch.style.transition = "transform 1.6s cubic-bezier(0.175,0.885,0.32,1.275)";
            branch.style.transform = curr;
          }, 90);
        }, i * 22);
      });
    }
  }

  useEffect(() => {
    generateTrees(footerTreesRef.current);
    return () => {
      if (footerTreesRef.current) footerTreesRef.current.innerHTML = "";
    };
  }, []);

  

  const socialLinks = [
    { name: "Twitter", Icon: IconBrandTwitter, href: "https://twitter.com/scrapp" },
    { name: "Instagram", Icon: IconBrandInstagram, href: "https://instagram.com/scrapp" },
    { name: "GitHub", Icon: IconBrandGithub, href: "https://github.com/scrapp" },
    { name: "Email", Icon: IconMail, href: "mailto:hello@scrapp.app" },
  ];

  return (
    <>
      <style>{`
        .trees-container {
          position: relative;
          background: ${palette.linen};
          overflow: hidden;
          height: 100%;
          width: 100%;
        }

        .tree {
          stroke: rgb(88, 129, 87);
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 0.6px;
          pointer-events: none;
          display: block;
          position: absolute;
          bottom: 0;
          transform-origin: center calc(100% - 0px);
        }

        .tree path { pointer-events: visibleStroke; }
        .tree path:not(.trunk) { pointer-events: none; }
        .tree .trunk { opacity: 0; }

        

        .green-band {
          height: 8px;
          background: ${palette.fern};
          width: 100%;
        }

        .footer-main { 
          background: ${palette.fern}; 
          color: white; 
        }

        .trees-strip {
          height: 64px;
        }

        @media (min-width: 768px) {
          .trees-strip {
            height: 80px;
          }
        }
      `}</style>

      <footer className="relative w-full" role="contentinfo">
        <div className="trees-strip relative">
          <div className="trees-container" ref={footerTreesRef}></div>
        </div>
        <div className="green-band" />

        <div className="footer-main">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconRecycle style={{ width: '24px', height: '24px', color: palette.linen }} />
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Scrapp</span>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  {socialLinks.map(link => (
                    <a 
                      key={link.name} 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: palette.linen, transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#a3b18a'}
                      onMouseLeave={(e) => e.currentTarget.style.color = palette.linen}
                      aria-label={link.name}
                    >
                      <link.Icon style={{ width: '20px', height: '20px' }} />
                    </a>
                  ))}
                </div>

                <div style={{ color: palette.linen, fontSize: '0.875rem', opacity: 0.9 }}>
                  © {currentYear} Scrapp
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${palette.pine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  padding: '6px 16px', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 500, 
                  background: palette.sage, 
                  color: palette.forest 
                }}>
                  🌱 Verified Recyclers • Impact Tracking • Rewards
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;