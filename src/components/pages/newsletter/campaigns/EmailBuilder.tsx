import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Popover,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Columns2,
  Copy,
  Eye,
  GripVertical,
  Image as ImageIcon,
  Layout,
  Mail,
  Maximize2,
  Minimize2,
  Minus,
  MousePointerClick,
  Plus,
  RefreshCcw,
  RotateCcw,
  Square,
  Trash2,
  Type,
  Heading1,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { colors } from "@/utils/customColor";

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
type TextAlign = "left" | "center" | "right";
type BlockType = "header"|"heading"|"text"|"image"|"button"|"divider"|"spacer"|"footer"|"columns"|"rawhtml";

interface HeadingData  { content:string; level:1|2|3; color:string; align:TextAlign; padding:number; }
interface TextData     { content:string; fontSize:number; color:string; align:TextAlign; padding:number; lineHeight:number; }
interface ImageData    { src:string; alt:string; width:number; align:TextAlign; link:string; }
interface ButtonData   { text:string; href:string; bgColor:string; textColor:string; borderRadius:number; align:TextAlign; paddingV:number; paddingH:number; fontSize:number; }
interface DividerData  { color:string; style:"solid"|"dashed"|"dotted"; margin:number; }
interface SpacerData   { height:number; }
interface HeaderData   { logoText:string; bgColor:string; textColor:string; subText:string; }
interface FooterData   { text:string; bgColor:string; textColor:string; }
interface ColumnsData  { colCount:number; gap:number; padding:number; bgColor:string; cols:Block[][]; }
interface RawHTMLData  { html:string; }
type BlockData = HeadingData|TextData|ImageData|ButtonData|DividerData|SpacerData|HeaderData|FooterData|ColumnsData|RawHTMLData;
interface Block { id:string; type:BlockType; data:BlockData; }

/* ═══════════════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════════════ */
const defaults: Record<BlockType, BlockData> = {
  header:  { logoText:"Your Brand", bgColor:colors.primary, textColor:"#ffffff", subText:"Monthly Newsletter" } as HeaderData,
  heading: { content:"Your Headline Here", level:1, color:"#1a1a1a", align:"center", padding:20 } as HeadingData,
  text:    { content:"Add your text content here. <strong>Double-click</strong> to edit inline.", fontSize:15, color:"#444444", align:"left", padding:16, lineHeight:1.7 } as TextData,
  image:   { src:"", alt:"Image", width:100, align:"center", link:"" } as ImageData,
  button:  { text:"Click Here", href:"#", bgColor:colors.primary, textColor:"#ffffff", borderRadius:4, align:"center", paddingV:13, paddingH:30, fontSize:15 } as ButtonData,
  divider: { color:"#e0e0e0", style:"solid", margin:16 } as DividerData,
  spacer:  { height:32 } as SpacerData,
  footer:  { text:"You are receiving this email because you subscribed.\n© 2025 Your Company · Unsubscribe", bgColor:"#f5f5f5", textColor:"#888888" } as FooterData,
  columns: { colCount:2, gap:16, padding:16, bgColor:"transparent", cols:[[],[]] } as ColumnsData,
  rawhtml: { html:"" } as RawHTMLData,
};

const STORAGE_KEY = "nl-email-builder-v2";
const previewWidths = { desktop:600, tablet:480, mobile:375 };

/* ═══════════════════════════════════════════════════
   HTML GENERATOR
═══════════════════════════════════════════════════ */
function blockToHTML(block: Block): string {
  switch (block.type) {
    case "header":  { const d=block.data as HeaderData; return `<tr><td style="background-color:${d.bgColor};padding:24px;text-align:center;"><div style="color:${d.textColor};font-size:24px;font-weight:700;">${d.logoText}</div>${d.subText?`<div style="color:${d.textColor};opacity:.75;font-size:13px;margin-top:4px;">${d.subText}</div>`:""}</td></tr>`; }
    case "heading": { const d=block.data as HeadingData; const sz:Record<number,string>={1:"28px",2:"22px",3:"18px"}; return `<tr><td style="padding:${d.padding}px 24px;"><h${d.level} style="color:${d.color};font-size:${sz[d.level]};font-weight:700;text-align:${d.align};margin:0;">${d.content}</h${d.level}></td></tr>`; }
    case "text":    { const d=block.data as TextData; return `<tr><td style="padding:${d.padding}px 24px;"><p style="color:${d.color};font-size:${d.fontSize}px;text-align:${d.align};line-height:${d.lineHeight};margin:0;">${d.content}</p></td></tr>`; }
    case "image":   { const d=block.data as ImageData; const img=d.src?`<img src="${d.src}" alt="${d.alt}" style="width:${d.width}%;max-width:100%;height:auto;display:block;${d.align==="center"?"margin:0 auto;":""}"/>`:`<div style="height:160px;background:#f0f0f0;text-align:center;line-height:160px;color:#aaa;font-size:13px;">Image placeholder</div>`; return `<tr><td>${d.link?`<a href="${d.link}">${img}</a>`:img}</td></tr>`; }
    case "button":  { const d=block.data as ButtonData; return `<tr><td style="padding:16px 24px;text-align:${d.align};"><a href="${d.href}" style="display:inline-block;background-color:${d.bgColor};color:${d.textColor};padding:${d.paddingV}px ${d.paddingH}px;border-radius:${d.borderRadius}px;font-size:${d.fontSize}px;font-weight:600;text-decoration:none;">${d.text}</a></td></tr>`; }
    case "divider": { const d=block.data as DividerData; return `<tr><td style="padding:${d.margin}px 24px;"><hr style="border:none;border-top:1px ${d.style} ${d.color};margin:0;"/></td></tr>`; }
    case "spacer":  { const d=block.data as SpacerData; return `<tr><td style="height:${d.height}px;">&nbsp;</td></tr>`; }
    case "footer":  { const d=block.data as FooterData; return `<tr><td style="background-color:${d.bgColor};padding:20px 24px;text-align:center;">${d.text.split("\n").map(l=>`<p style="color:${d.textColor};font-size:12px;margin:0;line-height:1.8;">${l}</p>`).join("")}</td></tr>`; }
    case "rawhtml": { const d=block.data as RawHTMLData; return d.html; }
    case "columns": {
      const d=block.data as ColumnsData;
      const pct=Math.floor(100/d.colCount);
      const cells=d.cols.map(col=>`<td width="${pct}%" valign="top" style="padding:${d.padding}px;">${col.map(b=>blockToHTML(b)).join("")}</td>`).join(`<td width="${d.gap}px"></td>`);
      return `<tr><td style="background-color:${d.bgColor!=="transparent"?d.bgColor:"#fff"};"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table></td></tr>`;
    }
    default: return "";
  }
}
function generateEmailHTML(blocks: Block[], bg: string): string {
  return `<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta charset="utf-8"/>\n  <meta name="viewport" content="width=device-width,initial-scale=1"/>\n  <title>Email</title>\n</head>\n<body style="margin:0;padding:0;background-color:${bg};font-family:Arial,Helvetica,sans-serif;">\n  <table width="100%" cellpadding="0" cellspacing="0" border="0">\n    <tr>\n      <td align="center" style="padding:20px 0;">\n        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;max-width:600px;">\n${blocks.map(blockToHTML).join("\n")}\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>`;
}

/* ═══════════════════════════════════════════════════
   INLINE TEXT EDITOR
═══════════════════════════════════════════════════ */
function InlineTextEditor({ content, style, toolbarRef, onSave, onEscape }: {
  content: string; style?: CSSProperties;
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  onSave: (html: string) => void; onEscape: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = content;
    ref.current.focus();
    try { const sel=window.getSelection(),range=document.createRange(); range.selectNodeContents(ref.current); range.collapse(false); sel?.removeAllRanges(); sel?.addRange(range); } catch {}
  }, []); // eslint-disable-line

  const handleBlur = (e: React.FocusEvent) => {
    const rt=toolbarRef.current;
    if (rt && e.relatedTarget instanceof Node && rt.contains(e.relatedTarget)) return;
    if (ref.current) onSave(ref.current.innerHTML);
  };
  return (
    <div ref={ref} contentEditable suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={(e)=>{ if(e.key==="Escape"){ e.preventDefault(); if(ref.current) onSave(ref.current.innerHTML); onEscape(); } }}
      style={{ outline:"none", cursor:"text", minHeight:24, whiteSpace:"pre-wrap", wordBreak:"break-word", ...style }}
    />
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING RICH TEXT TOOLBAR (portal)
═══════════════════════════════════════════════════ */
function FloatingRichToolbar({ toolbarRef, blockRef }: {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  blockRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState({ top: -1000, left: 0, width: 0 });
  const savedRangeRef = useRef<Range | null>(null);
  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");

  useLayoutEffect(() => {
    const update = () => {
      if (!blockRef.current) return;
      const r = blockRef.current.getBoundingClientRect();
      setPos({ top: Math.max(8, r.top - 54), left: Math.max(8, r.left), width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [blockRef]);

  const exec = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); };

  const saveRange = () => {
    const s = window.getSelection();
    if (s && s.rangeCount > 0) savedRangeRef.current = s.getRangeAt(0).cloneRange();
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) return;
    setLinkAnchorEl(null);
    setTimeout(() => {
      const el = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
      if (el) { el.focus(); const s=window.getSelection(); if(s&&savedRangeRef.current){s.removeAllRanges();s.addRange(savedRangeRef.current);} document.execCommand("createLink",false,url); }
      setLinkUrl("");
    }, 30);
  };

  /* Toolbar button */
  const Btn = ({ title, onMD, children, danger }: { title:string; onMD:(e:React.MouseEvent)=>void; children:React.ReactNode; danger?:boolean }) => (
    <Tooltip title={title} placement="top">
      <Box component="button" type="button"
        onMouseDown={(e:React.MouseEvent)=>{ e.preventDefault(); onMD(e); }}
        sx={{ display:"flex",alignItems:"center",justifyContent:"center", width:26,height:26, border:"none", borderRadius:0.75, bgcolor:"transparent", color:danger?"#dc2626":"#333", cursor:"pointer", fontSize:"0.8125rem", fontWeight:700, flexShrink:0, "&:hover":{ bgcolor:"#f0f0f0" } }}
      >{children}</Box>
    </Tooltip>
  );
  const Sep = () => <Box sx={{ width:"1px",height:16,bgcolor:"#e0e0e0",mx:0.25,flexShrink:0 }} />;

  return createPortal(
    <Box ref={toolbarRef as React.RefObject<HTMLDivElement>} tabIndex={-1}
      sx={{ position:"fixed", top:pos.top, left:pos.left, zIndex:99999,
        display:"flex",alignItems:"center",gap:0.25,px:1,py:0.625,
        bgcolor:"#fff", border:"1px solid #e0e0e0", borderRadius:1.5,
        boxShadow:"0 4px 20px rgba(0,0,0,0.15)", outline:"none",
        flexWrap:"nowrap", overflowX:"auto",
      }}
    >
      <Btn title="Bold" onMD={()=>exec("bold")}><strong>B</strong></Btn>
      <Btn title="Italic" onMD={()=>exec("italic")}><em>I</em></Btn>
      <Btn title="Underline" onMD={()=>exec("underline")}><span style={{textDecoration:"underline"}}>U</span></Btn>
      <Btn title="Strikethrough" onMD={()=>exec("strikeThrough")}><span style={{textDecoration:"line-through"}}>S</span></Btn>
      <Sep/>
      <Btn title="Superscript" onMD={()=>exec("superscript")}>x²</Btn>
      <Btn title="Subscript" onMD={()=>exec("subscript")}>x₂</Btn>
      <Sep/>
      {/* Text color */}
      <Tooltip title="Text Color" placement="top">
        <Box component="label" sx={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:26,height:26,cursor:"pointer",borderRadius:0.75,"&:hover":{bgcolor:"#f0f0f0"},position:"relative",flexShrink:0 }}>
          <Typography sx={{fontWeight:700,fontSize:"0.875rem",lineHeight:1,color:"#333"}}>A</Typography>
          <Box sx={{width:16,height:3,bgcolor:"#e53935",borderRadius:0.5}}/>
          <input type="color" defaultValue="#000000" onMouseDown={(e)=>e.stopPropagation()} onChange={(e)=>exec("foreColor",e.target.value)} style={{position:"absolute",opacity:0,inset:0,width:"100%",height:"100%",cursor:"pointer"}}/>
        </Box>
      </Tooltip>
      {/* Highlight */}
      <Tooltip title="Highlight" placement="top">
        <Box component="label" sx={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:26,height:26,cursor:"pointer",borderRadius:0.75,"&:hover":{bgcolor:"#f0f0f0"},position:"relative",flexShrink:0 }}>
          <Typography sx={{fontWeight:700,fontSize:"0.875rem",lineHeight:1,color:"#333"}}>A</Typography>
          <Box sx={{width:16,height:3,bgcolor:"#ffeb3b",borderRadius:0.5}}/>
          <input type="color" defaultValue="#ffff00" onMouseDown={(e)=>e.stopPropagation()} onChange={(e)=>exec("hiliteColor",e.target.value)} style={{position:"absolute",opacity:0,inset:0,width:"100%",height:"100%",cursor:"pointer"}}/>
        </Box>
      </Tooltip>
      <Sep/>
      <Btn title="Align Left" onMD={()=>exec("justifyLeft")}><AlignLeft size={13}/></Btn>
      <Btn title="Align Center" onMD={()=>exec("justifyCenter")}><AlignCenter size={13}/></Btn>
      <Btn title="Align Right" onMD={()=>exec("justifyRight")}><AlignRight size={13}/></Btn>
      <Sep/>
      <Btn title="Add Link" onMD={(e)=>{ saveRange(); setLinkAnchorEl(e.currentTarget as HTMLElement); }}>🔗</Btn>
      <Btn title="Remove Link" onMD={()=>exec("unlink")} danger>✕🔗</Btn>
      <Sep/>
      <Btn title="Bullet List" onMD={()=>exec("insertUnorderedList")}>•</Btn>
      <Btn title="Numbered List" onMD={()=>exec("insertOrderedList")}>1.</Btn>
      <Sep/>
      <Btn title="Clear Formatting" onMD={()=>exec("removeFormat")}>Tx✕</Btn>

      {/* Link popover */}
      <Popover open={Boolean(linkAnchorEl)} anchorEl={linkAnchorEl} onClose={()=>{setLinkAnchorEl(null);setLinkUrl("");}} anchorOrigin={{vertical:"bottom",horizontal:"left"}}>
        <Box sx={{p:1.5,display:"flex",gap:1,alignItems:"center"}}>
          <TextField size="small" placeholder="https://..." value={linkUrl} onChange={(e)=>setLinkUrl(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==="Enter") applyLink(); }}
            sx={{width:240}} autoFocus
          />
          <IconButton size="small" onClick={applyLink} sx={{bgcolor:colors.primary,color:"#fff","&:hover":{bgcolor:colors.primary,filter:"brightness(0.9)"}}}>
            <Check size={14}/>
          </IconButton>
        </Box>
      </Popover>
    </Box>,
    document.body
  );
}

/* ═══════════════════════════════════════════════════
   BLOCK RENDERER
═══════════════════════════════════════════════════ */
interface BRProps {
  block: Block; isEditing: boolean;
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  onSaveText: (id:string,html:string)=>void;
  onEscapeEdit: ()=>void;
  onColDragOver?: (e:React.DragEvent,colIdx:number,subIdx:number)=>void;
  onColDrop?:     (e:React.DragEvent,colIdx:number,subIdx:number)=>void;
  onColBlockClick?:(colIdx:number,subIdx:number)=>void;
  onColBlockDelete?:(colIdx:number,subIdx:number)=>void;
  colDropTarget?: {colIdx:number;subIdx:number}|null;
  selectedSubPath?: {colIdx:number;subIdx:number}|null;
  isDragging?: boolean;
}
function BlockRenderer(p: BRProps) {
  const { block, isEditing, toolbarRef, onSaveText, onEscapeEdit } = p;
  switch (block.type) {
    case "header": { const d=block.data as HeaderData; return <Box sx={{bgcolor:d.bgColor,px:4,py:3,textAlign:"center"}}><Typography sx={{color:d.textColor,fontSize:"1.5rem",fontWeight:700}}>{d.logoText}</Typography>{d.subText&&<Typography sx={{color:d.textColor,opacity:.75,fontSize:"0.85rem",mt:0.5}}>{d.subText}</Typography>}</Box>; }
    case "heading": {
      const d=block.data as HeadingData;
      const sz:Record<number,string>={1:"1.75rem",2:"1.375rem",3:"1.125rem"};
      const st:CSSProperties={ fontSize:sz[d.level],fontWeight:700,color:d.color,textAlign:d.align,lineHeight:1.3,margin:0 };
      return <Box sx={{px:3,py:`${d.padding}px`}}>{isEditing?<InlineTextEditor content={d.content} toolbarRef={toolbarRef} style={st} onSave={(h)=>onSaveText(block.id,h)} onEscape={onEscapeEdit}/>:<div style={st} dangerouslySetInnerHTML={{__html:d.content}}/>}</Box>;
    }
    case "text": {
      const d=block.data as TextData;
      const st:CSSProperties={ fontSize:`${d.fontSize}px`,color:d.color,textAlign:d.align,lineHeight:d.lineHeight,margin:0,minHeight:24 };
      return <Box sx={{px:3,py:`${d.padding}px`}}>{isEditing?<InlineTextEditor content={d.content} toolbarRef={toolbarRef} style={st} onSave={(h)=>onSaveText(block.id,h)} onEscape={onEscapeEdit}/>:<p style={st} dangerouslySetInnerHTML={{__html:d.content}}/>}</Box>;
    }
    case "image": { const d=block.data as ImageData; return <Box sx={{textAlign:d.align}}>{d.src?<Box component="img" src={d.src} alt={d.alt} draggable={false} sx={{width:`${d.width}%`,maxWidth:"100%",display:"block",mx:d.align==="center"?"auto":undefined}}/>:<Box sx={{width:`${d.width}%`,mx:d.align==="center"?"auto":undefined,height:160,bgcolor:"#f0f0f0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,border:"2px dashed #ddd"}}><ImageIcon size={28} color="#bbb" strokeWidth={1.25}/><Typography sx={{fontSize:"0.8rem",color:"#bbb"}}>Set image URL →</Typography></Box>}</Box>; }
    case "button": { const d=block.data as ButtonData; return <Box sx={{px:3,py:2,textAlign:d.align}}><Box component="span" sx={{display:"inline-block",bgcolor:d.bgColor,color:d.textColor,px:`${d.paddingH}px`,py:`${d.paddingV}px`,borderRadius:`${d.borderRadius}px`,fontSize:`${d.fontSize}px`,fontWeight:600,cursor:"pointer"}}>{d.text}</Box></Box>; }
    case "divider": { const d=block.data as DividerData; return <Box sx={{px:3,py:`${d.margin}px`}}><Box component="hr" sx={{border:"none",borderTop:`1px ${d.style} ${d.color}`,m:0}}/></Box>; }
    case "spacer":  { const d=block.data as SpacerData; return <Box sx={{height:`${d.height}px`,display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"#fafafa",borderTop:"1px dashed #eee",borderBottom:"1px dashed #eee"}}><Typography sx={{fontSize:"0.7rem",color:"#ccc",fontFamily:"monospace"}}>{d.height}px spacer</Typography></Box>; }
    case "footer":  { const d=block.data as FooterData; return <Box sx={{bgcolor:d.bgColor,px:3,py:2.5,textAlign:"center"}}>{d.text.split("\n").map((l,i)=><Typography key={i} sx={{fontSize:"0.78rem",color:d.textColor,lineHeight:1.8}}>{l}</Typography>)}</Box>; }
    case "rawhtml": { const d=block.data as RawHTMLData; return <Box sx={{p:1}}><div dangerouslySetInnerHTML={{__html:d.html}}/></Box>; }
    case "columns": {
      const d=block.data as ColumnsData;
      return (
        <Box sx={{display:"grid",gridTemplateColumns:`repeat(${d.colCount},1fr)`,gap:`${d.gap}px`,p:`${d.padding}px`,bgcolor:d.bgColor!=="transparent"?d.bgColor:undefined}}>
          {d.cols.map((col,colIdx)=>(
            <Box key={colIdx}
              onDragOver={(e)=>{e.preventDefault();e.stopPropagation();p.onColDragOver?.(e,colIdx,col.length);}}
              onDrop={(e)=>{e.preventDefault();e.stopPropagation();p.onColDrop?.(e,colIdx,col.length);}}
              sx={{minHeight:80,border:`1.5px dashed ${p.isDragging?colors.primary+"55":"#ddd"}`,borderRadius:1,bgcolor:"#fff",transition:"border-color 0.12s"}}
            >
              {col.length===0?(
                <Box sx={{height:80,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Typography sx={{fontSize:"0.75rem",color:"#bbb"}}>Drop blocks here</Typography>
                </Box>
              ):(
                col.map((sub,subIdx)=>{
                  const isSel = p.selectedSubPath?.colIdx===colIdx && p.selectedSubPath?.subIdx===subIdx;
                  return (
                    <Box key={sub.id}
                      onDragOver={(e)=>{e.preventDefault();e.stopPropagation();p.onColDragOver?.(e,colIdx,subIdx);}}
                      onDrop={(e)=>{e.preventDefault();e.stopPropagation();p.onColDrop?.(e,colIdx,subIdx);}}
                      onClick={(e)=>{e.stopPropagation();p.onColBlockClick?.(colIdx,subIdx);}}
                      sx={{
                        position:"relative",cursor:"pointer",
                        outline:isSel?`2px solid ${colors.primary}`:"2px solid transparent",
                        borderBottom:p.colDropTarget?.colIdx===colIdx&&p.colDropTarget?.subIdx===subIdx?`2px solid ${colors.primary}`:"2px solid transparent",
                        "&:hover .col-toolbar":{opacity:1},
                      }}
                    >
                      <BlockRenderer block={sub} isEditing={false} toolbarRef={toolbarRef} onSaveText={onSaveText} onEscapeEdit={onEscapeEdit}/>
                      <Box className="col-toolbar" sx={{position:"absolute",top:2,right:2,opacity:0,transition:"opacity 0.15s",display:"flex",gap:0.25,bgcolor:"rgba(255,255,255,0.95)",borderRadius:1,border:"1px solid #eee"}}>
                        <IconButton size="small" onClick={(e)=>{e.stopPropagation();p.onColBlockDelete?.(colIdx,subIdx);}} sx={{"&:hover":{color:"#dc2626"}}}><Trash2 size={12}/></IconButton>
                      </Box>
                      {isSel&&<Box sx={{position:"absolute",top:-1,left:-1,bgcolor:colors.primary,borderRadius:"0 0 4px 0",px:0.75,py:0.15,zIndex:5}}><Typography sx={{fontSize:"0.6rem",color:"#fff",fontWeight:700,textTransform:"capitalize"}}>{sub.type}</Typography></Box>}
                    </Box>
                  );
                })
              )}
            </Box>
          ))}
        </Box>
      );
    }
    default: return null;
  }
}

/* ═══════════════════════════════════════════════════
   PROPERTIES PANEL
═══════════════════════════════════════════════════ */
function PropRow({label,children}:{label:string;children:React.ReactNode}){
  return <Box sx={{mb:1.75}}><Typography sx={{fontSize:"0.68rem",color:"#888",mb:0.6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</Typography>{children}</Box>;
}
function AlignBtns({value,onChange}:{value:TextAlign;onChange:(v:TextAlign)=>void}){
  return <Box sx={{display:"flex",gap:0.5}}>{(["left","center","right"] as TextAlign[]).map(a=>{const Ic=a==="left"?AlignLeft:a==="center"?AlignCenter:AlignRight; return <IconButton key={a} size="small" onClick={()=>onChange(a)} sx={{border:`1px solid ${value===a?colors.primary:"#e0e0e0"}`,borderRadius:1,bgcolor:value===a?`${colors.primary}12`:"transparent",color:value===a?colors.primary:"#888"}}><Ic size={14}/></IconButton>; })}</Box>;
}
function ColorRow({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){
  return <PropRow label={label}><Box sx={{display:"flex",gap:1}}><input type="color" value={value} onChange={(e)=>onChange(e.target.value)} style={{width:32,height:28,border:"1px solid #e0e0e0",borderRadius:4,cursor:"pointer",padding:2}}/><TextField size="small" value={value} sx={{flex:1}} onChange={(e)=>onChange(e.target.value)}/></Box></PropRow>;
}
function PropertiesPanel({ block, onChange, textEditId, onStartEdit }: {
  block:Block; onChange:(p:Partial<BlockData>)=>void; textEditId:string|null; onStartEdit:()=>void;
}) {
  const d=block.data as any;
  const isText=block.type==="text"||block.type==="heading";
  return (
    <Box sx={{p:1.75,overflowY:"auto",height:"100%"}}>
      <Typography sx={{fontWeight:700,color:"#1a1a1a",mb:1.5,fontSize:"0.8125rem",textTransform:"capitalize"}}>{block.type} Block</Typography>

      {/* Inline edit hint */}
      {isText&&<Box onClick={onStartEdit} sx={{border:`1px dashed ${textEditId===block.id?colors.primary:"#ccc"}`,borderRadius:1,p:1,mb:1.5,cursor:"pointer",bgcolor:textEditId===block.id?`${colors.primary}08`:"#fafafa",textAlign:"center","&:hover":{borderColor:colors.primary,bgcolor:`${colors.primary}08`}}}>
        <Typography sx={{fontSize:"0.75rem",color:textEditId===block.id?colors.primary:"#888",fontWeight:500}}>
          {textEditId===block.id?"✏️ Editing inline…":"Click or double-click block to edit text"}
        </Typography>
      </Box>}

      {block.type==="header"&&<><PropRow label="Brand Name"><TextField size="small" fullWidth value={d.logoText} onChange={(e)=>onChange({logoText:e.target.value})}/></PropRow><PropRow label="Subtitle"><TextField size="small" fullWidth value={d.subText} onChange={(e)=>onChange({subText:e.target.value})}/></PropRow><ColorRow label="Background" value={d.bgColor} onChange={(v)=>onChange({bgColor:v})}/><ColorRow label="Text" value={d.textColor} onChange={(v)=>onChange({textColor:v})}/></>}
      {block.type==="heading"&&<><PropRow label="Level"><Select size="small" fullWidth value={d.level} onChange={(e)=>onChange({level:Number(e.target.value) as 1|2|3})}><MenuItem value={1}>H1 — Large</MenuItem><MenuItem value={2}>H2 — Medium</MenuItem><MenuItem value={3}>H3 — Small</MenuItem></Select></PropRow><ColorRow label="Color" value={d.color} onChange={(v)=>onChange({color:v})}/><PropRow label="Alignment"><AlignBtns value={d.align} onChange={(v)=>onChange({align:v})}/></PropRow><PropRow label={`Padding: ${d.padding}px`}><Slider value={d.padding} min={0} max={60} step={4} onChange={(_,v)=>onChange({padding:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow></>}
      {block.type==="text"&&<><PropRow label={`Font Size: ${d.fontSize}px`}><Slider value={d.fontSize} min={10} max={28} step={1} onChange={(_,v)=>onChange({fontSize:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow><ColorRow label="Color" value={d.color} onChange={(v)=>onChange({color:v})}/><PropRow label="Alignment"><AlignBtns value={d.align} onChange={(v)=>onChange({align:v})}/></PropRow><PropRow label={`Line Height: ${d.lineHeight}`}><Slider value={d.lineHeight} min={1} max={2.5} step={0.1} onChange={(_,v)=>onChange({lineHeight:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow></>}
      {block.type==="image"&&<><PropRow label="Image URL"><TextField size="small" fullWidth placeholder="https://..." value={d.src} onChange={(e)=>onChange({src:e.target.value})}/></PropRow><PropRow label="Alt Text"><TextField size="small" fullWidth value={d.alt} onChange={(e)=>onChange({alt:e.target.value})}/></PropRow><PropRow label="Link URL"><TextField size="small" fullWidth placeholder="https://..." value={d.link} onChange={(e)=>onChange({link:e.target.value})}/></PropRow><PropRow label={`Width: ${d.width}%`}><Slider value={d.width} min={20} max={100} step={5} onChange={(_,v)=>onChange({width:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow><PropRow label="Alignment"><AlignBtns value={d.align} onChange={(v)=>onChange({align:v})}/></PropRow></>}
      {block.type==="button"&&<><PropRow label="Text"><TextField size="small" fullWidth value={d.text} onChange={(e)=>onChange({text:e.target.value})}/></PropRow><PropRow label="Link URL"><TextField size="small" fullWidth placeholder="https://..." value={d.href} onChange={(e)=>onChange({href:e.target.value})}/></PropRow><ColorRow label="Background" value={d.bgColor} onChange={(v)=>onChange({bgColor:v})}/><ColorRow label="Text" value={d.textColor} onChange={(v)=>onChange({textColor:v})}/><PropRow label="Alignment"><AlignBtns value={d.align} onChange={(v)=>onChange({align:v})}/></PropRow><PropRow label={`Radius: ${d.borderRadius}px`}><Slider value={d.borderRadius} min={0} max={30} step={2} onChange={(_,v)=>onChange({borderRadius:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow><PropRow label={`Font: ${d.fontSize}px`}><Slider value={d.fontSize} min={12} max={22} step={1} onChange={(_,v)=>onChange({fontSize:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow></>}
      {block.type==="divider"&&<><ColorRow label="Color" value={d.color} onChange={(v)=>onChange({color:v})}/><PropRow label="Style"><Select size="small" fullWidth value={d.style} onChange={(e)=>onChange({style:e.target.value})}><MenuItem value="solid">Solid</MenuItem><MenuItem value="dashed">Dashed</MenuItem><MenuItem value="dotted">Dotted</MenuItem></Select></PropRow><PropRow label={`Margin: ${d.margin}px`}><Slider value={d.margin} min={0} max={60} step={4} onChange={(_,v)=>onChange({margin:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow></>}
      {block.type==="spacer"&&<PropRow label={`Height: ${d.height}px`}><Slider value={d.height} min={8} max={120} step={8} onChange={(_,v)=>onChange({height:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow>}
      {block.type==="footer"&&<><PropRow label="Text"><TextField size="small" fullWidth multiline rows={3} value={d.text} onChange={(e)=>onChange({text:e.target.value})}/></PropRow><ColorRow label="Background" value={d.bgColor} onChange={(v)=>onChange({bgColor:v})}/><ColorRow label="Text" value={d.textColor} onChange={(v)=>onChange({textColor:v})}/></>}
      {block.type==="rawhtml"&&<><PropRow label="Raw HTML"><TextField size="small" fullWidth multiline rows={8} value={d.html} onChange={(e)=>onChange({html:e.target.value})}/></PropRow><Typography sx={{fontSize:"0.72rem",color:"#aaa",mt:-1}}>Edit directly in the HTML tab for syntax highlighting.</Typography></>}
      {block.type==="columns"&&(
        <>
          <PropRow label={`Columns: ${d.colCount}`}>
            <Box sx={{display:"flex",alignItems:"center",gap:1}}>
              <IconButton size="small" disabled={d.colCount<=1} onClick={()=>{const n=Math.max(1,d.colCount-1);onChange({colCount:n,cols:(d.cols as Block[][]).slice(0,n)});}} sx={{border:"1px solid #e0e0e0",borderRadius:1,width:28,height:28}}><Minus size={13}/></IconButton>
              <Typography sx={{fontWeight:700,minWidth:20,textAlign:"center"}}>{d.colCount}</Typography>
              <IconButton size="small" disabled={d.colCount>=6} onClick={()=>{const n=Math.min(6,d.colCount+1);const cols=[...(d.cols as Block[][])];while(cols.length<n)cols.push([]);onChange({colCount:n,cols});}} sx={{border:"1px solid #e0e0e0",borderRadius:1,width:28,height:28}}><Plus size={13}/></IconButton>
              <Typography sx={{fontSize:"0.72rem",color:"#888"}}>(min 1, max 6)</Typography>
            </Box>
          </PropRow>
          <PropRow label={`Gap: ${d.gap}px`}><Slider value={d.gap} min={0} max={48} step={4} onChange={(_,v)=>onChange({gap:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow>
          <PropRow label={`Padding: ${d.padding}px`}><Slider value={d.padding} min={0} max={48} step={4} onChange={(_,v)=>onChange({padding:v as number})} sx={{color:colors.primary,py:0.5}}/></PropRow>
          <ColorRow label="Background" value={d.bgColor==="transparent"?"#ffffff":d.bgColor} onChange={(v)=>onChange({bgColor:v})}/>
        </>
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════
   DROPZONE
═══════════════════════════════════════════════════ */
function DropZone({index,active,onDragOver,onDrop}:{index:number;active:boolean;onDragOver:(e:React.DragEvent,i:number)=>void;onDrop:(e:React.DragEvent,i:number)=>void}){
  return <Box onDragOver={(e)=>onDragOver(e,index)} onDrop={(e)=>onDrop(e,index)} sx={{height:active?30:4,mx:active?0:2,borderRadius:0.5,bgcolor:active?`${colors.primary}18`:"transparent",border:active?`2px dashed ${colors.primary}`:"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>{active&&<Typography sx={{fontSize:"0.7rem",color:colors.primary,fontWeight:600}}>Drop here</Typography>}</Box>;
}

/* ═══════════════════════════════════════════════════
   IMAGE RESIZE OVERLAY
═══════════════════════════════════════════════════ */
function ImageResizeOverlay({block,onWidthChange}:{block:Block;onWidthChange:(w:number)=>void}){
  const d=block.data as ImageData;
  const containerRef=useRef<HTMLDivElement>(null);
  const dRef=useRef({dragging:false,startX:0,startW:0});
  const onMD=(e:React.MouseEvent)=>{
    e.stopPropagation();e.preventDefault();
    dRef.current={dragging:true,startX:e.clientX,startW:d.width};
    const onMV=(ev:MouseEvent)=>{if(!dRef.current.dragging||!containerRef.current)return;const pw=containerRef.current.parentElement?.offsetWidth??600;const dx=ev.clientX-dRef.current.startX;onWidthChange(Math.round(Math.max(20,Math.min(100,dRef.current.startW+(dx/pw)*100))));};
    const onMU=()=>{dRef.current.dragging=false;window.removeEventListener("mousemove",onMV);window.removeEventListener("mouseup",onMU);};
    window.addEventListener("mousemove",onMV);window.addEventListener("mouseup",onMU);
  };
  return <Box ref={containerRef} sx={{position:"absolute",inset:0,pointerEvents:"none"}}><Box onMouseDown={onMD} sx={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",width:12,height:40,bgcolor:colors.primary,borderRadius:"6px 0 0 6px",cursor:"ew-resize",pointerEvents:"all",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.85,"&:hover":{opacity:1}}}><Box sx={{width:1.5,height:18,bgcolor:"#fff",borderRadius:1,mx:0.2}}/><Box sx={{width:1.5,height:18,bgcolor:"#fff",borderRadius:1,mx:0.2}}/></Box><Box sx={{position:"absolute",bottom:6,right:16,bgcolor:"rgba(0,0,0,0.55)",borderRadius:1,px:1,py:0.25}}><Typography sx={{fontSize:"0.68rem",color:"#fff"}}>{d.width}%</Typography></Box></Box>;
}

/* ═══════════════════════════════════════════════════
   PALETTE
═══════════════════════════════════════════════════ */
const palette: {type:BlockType;label:string;Icon:React.ComponentType<{size?:number;color?:string;strokeWidth?:number}>;}[] = [
  {type:"header",  label:"Header",  Icon:Layout},
  {type:"heading", label:"Heading", Icon:Heading1},
  {type:"text",    label:"Text",    Icon:Type},
  {type:"image",   label:"Image",   Icon:ImageIcon},
  {type:"button",  label:"Button",  Icon:MousePointerClick},
  {type:"divider", label:"Divider", Icon:Minus},
  {type:"spacer",  label:"Spacer",  Icon:Square},
  {type:"footer",  label:"Footer",  Icon:Mail},
  {type:"columns", label:"Cols",    Icon:Columns2},
];

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
export default function EmailBuilder() {
  const [blocks,setBlocks]         = useState<Block[]>([]);
  const [bgColor,setBgColor]       = useState("#f0f0f0");
  const [selectedId,setSelectedId] = useState<string|null>(null);
  const [selectedSub,setSelectedSub] = useState<{blockId:string;colIdx:number;subIdx:number}|null>(null);
  const [textEditId,setTextEditId] = useState<string|null>(null);
  const [isFullscreen,setIsFullscreen] = useState(false);
  const [viewMode,setViewMode]     = useState<"design"|"html">("design");
  const [preview,setPreview]       = useState<"desktop"|"tablet"|"mobile">("desktop");
  const [dropIndex,setDropIndex]   = useState<number|null>(null);
  const [colDrop,setColDrop]       = useState<{blockId:string;colIdx:number;subIdx:number}|null>(null);
  const [htmlDraft,setHtmlDraft]   = useState("");
  const [htmlEdited,setHtmlEdited] = useState(false);
  const [htmlCopied,setHtmlCopied] = useState(false);
  const [showPreviewModal,setShowPreviewModal] = useState(false);

  const toolbarRef = useRef<HTMLDivElement|null>(null);
  const editingBlockRef = useRef<HTMLDivElement|null>(null);
  const dragSrcRef = useRef<{kind:"palette";blockType:BlockType;label?:string}|{kind:"canvas";id:string;index:number}|null>(null);
  const isDragging = dragSrcRef.current !== null;

  /* localStorage */
  useEffect(() => {
    try { const s=localStorage.getItem(STORAGE_KEY); if(s){const d=JSON.parse(s);setBlocks(d.blocks||[]);setBgColor(d.bgColor||"#f0f0f0");} } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify({blocks,bgColor})); } catch {}
  }, [blocks,bgColor]);

  /* Fullscreen Esc */
  useEffect(() => {
    const fn=(e:KeyboardEvent)=>{ if(e.key==="Escape"&&isFullscreen) setIsFullscreen(false); };
    window.addEventListener("keydown",fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[isFullscreen]);

  /* Resolved selected block for properties panel */
  const propertiesTarget = useMemo(():{block:Block;onChange:(p:Partial<BlockData>)=>void;textId:string|null}|null =>{
    if (selectedSub) {
      const parent=blocks.find(b=>b.id===selectedSub.blockId);
      if(!parent||parent.type!=="columns") return null;
      const d=parent.data as ColumnsData;
      const sub=d.cols[selectedSub.colIdx]?.[selectedSub.subIdx];
      if(!sub) return null;
      return {
        block:sub,
        textId: null,
        onChange:(partial)=>{
          const nc=d.cols.map((col,ci)=>ci===selectedSub.colIdx?col.map((sb,si)=>si===selectedSub.subIdx?{...sb,data:{...sb.data,...partial}}:sb):col);
          setBlocks(prev=>prev.map(b=>b.id===selectedSub.blockId?{...b,data:{...b.data,cols:nc}}:b));
        }
      };
    }
    const block=blocks.find(b=>b.id===selectedId);
    if(!block) return null;
    return { block, textId:textEditId, onChange:(p)=>setBlocks(prev=>prev.map(b=>b.id===selectedId?{...b,data:{...b.data,...p}}:b)) };
  },[blocks,selectedId,selectedSub,textEditId]);

  /* Mutations */
  const addBlock=useCallback((type:BlockType,at:number,overrides?:Partial<BlockData>)=>{
    const nb:Block={id:uuidv4(),type,data:{...defaults[type],...overrides}};
    setBlocks(p=>{const n=[...p];n.splice(at,0,nb);return n;});
    setSelectedId(nb.id); setSelectedSub(null);
  },[]);
  const removeBlock=useCallback((id:string)=>{setBlocks(p=>p.filter(b=>b.id!==id));setSelectedId(s=>s===id?null:s);setTextEditId(s=>s===id?null:s);},[]);
  const moveBlock=useCallback((from:number,to:number)=>{setBlocks(p=>{if(to<0||to>=p.length)return p;const n=[...p];const[x]=n.splice(from,1);n.splice(to,0,x);return n;});},[]);
  const saveText=useCallback((id:string,html:string)=>{setBlocks(p=>p.map(b=>b.id===id?{...b,data:{...b.data,content:html}}:b));setTextEditId(null);},[]);

  /* Column sub mutations */
  const onColDragOver=(e:React.DragEvent,blockId:string,colIdx:number,subIdx:number)=>{e.preventDefault();e.stopPropagation();setColDrop({blockId,colIdx,subIdx});setDropIndex(null);};
  const onColDrop=(e:React.DragEvent,parentId:string,colIdx:number,subIdx:number)=>{
    e.preventDefault();e.stopPropagation();
    const src=dragSrcRef.current;
    if(!src||src.kind!=="palette"||src.blockType==="columns"){dragSrcRef.current=null;setColDrop(null);return;}
    const nb:Block={id:uuidv4(),type:src.blockType,data:{...defaults[src.blockType]}};
    setBlocks(prev=>prev.map(b=>{
      if(b.id!==parentId||b.type!=="columns")return b;
      const d=b.data as ColumnsData;
      const nc=d.cols.map((col,ci)=>{if(ci!==colIdx)return col;const n=[...col];n.splice(subIdx,0,nb);return n;});
      return {...b,data:{...d,cols:nc}};
    }));
    setSelectedSub({blockId:parentId,colIdx,subIdx});
    dragSrcRef.current=null;setColDrop(null);
  };
  const onColBlockDelete=(parentId:string,colIdx:number,subIdx:number)=>{
    setBlocks(prev=>prev.map(b=>{if(b.id!==parentId||b.type!=="columns")return b;const d=b.data as ColumnsData;const nc=d.cols.map((col,ci)=>ci===colIdx?col.filter((_,si)=>si!==subIdx):col);return{...b,data:{...d,cols:nc}};}));
    setSelectedSub(null);
  };

  /* Root drag */
  const onPalDragStart=(e:React.DragEvent,type:BlockType,label:string)=>{dragSrcRef.current={kind:"palette",blockType:type,label};e.dataTransfer.effectAllowed="copy";};
  const onBlockDragStart=(e:React.DragEvent,id:string,idx:number)=>{e.stopPropagation();dragSrcRef.current={kind:"canvas",id,index:idx};e.dataTransfer.effectAllowed="move";};
  const onDropZoneDragOver=(e:React.DragEvent,idx:number)=>{e.preventDefault();e.stopPropagation();setDropIndex(idx);setColDrop(null);};
  const onDropZoneDrop=(e:React.DragEvent,idx:number)=>{
    e.preventDefault();e.stopPropagation();
    const src=dragSrcRef.current;if(!src)return;
    if(src.kind==="palette"){
      const ov:Partial<ColumnsData>={};
      if(src.blockType==="columns"&&src.label==="3 Cols"){ov.colCount=3;ov.cols=[[],[],[]];}
      addBlock(src.blockType,idx,ov as Partial<BlockData>);
    } else {
      const t=src.index<idx?idx-1:idx;moveBlock(src.index,t);
    }
    dragSrcRef.current=null;setDropIndex(null);
  };
  const onDragEnd=()=>{dragSrcRef.current=null;setDropIndex(null);setColDrop(null);};

  /* HTML view */
  const switchToHTML=()=>{ setHtmlDraft(generateEmailHTML(blocks,bgColor)); setHtmlEdited(false); setViewMode("html"); };
  const switchToDesign=()=>{
    if(htmlEdited){
      setBlocks([{id:uuidv4(),type:"rawhtml",data:{html:htmlDraft} as RawHTMLData}]);
      setSelectedId(null); setSelectedSub(null);
    }
    setViewMode("design");
  };

  /* Reset */
  const reset=()=>{ setBlocks([]);setBgColor("#f0f0f0");setSelectedId(null);setSelectedSub(null);setTextEditId(null);localStorage.removeItem(STORAGE_KEY); };

  /* ── Render ── */
  return (
    <Box sx={{ display:"flex",flexDirection:"column", ...(isFullscreen?{position:"fixed",inset:0,zIndex:9999,bgcolor:"#fff"}:{height:"100%",minHeight:580}) }}>

      {/* ─ Top Bar ─ */}
      <Box sx={{display:"flex",alignItems:"center",gap:1,px:2,py:0.75,bgcolor:"#fafafa",borderBottom:"1px solid #e8e8e8",flexShrink:0,flexWrap:"wrap",rowGap:0.5}}>
        <Typography sx={{fontSize:"0.78rem",fontWeight:600,color:"#555",mr:"auto"}}>{blocks.length} block{blocks.length!==1?"s":""} · {preview}</Typography>


        {/* Canvas bg */}
        {viewMode==="design"&&<Tooltip title="Canvas background"><Box sx={{display:"flex",alignItems:"center",gap:0.75}}><Typography sx={{fontSize:"0.72rem",color:"#888"}}>BG</Typography><input type="color" value={bgColor} onChange={(e)=>setBgColor(e.target.value)} style={{width:26,height:20,border:"1px solid #ddd",borderRadius:3,cursor:"pointer",padding:1}}/></Box></Tooltip>}

        <Divider orientation="vertical" flexItem sx={{borderColor:"#e0e0e0"}}/>

        {/* Design/HTML */}
        {(["design","html"] as const).map(m=>(
          <Box key={m} component="button" onClick={()=>m==="html"?switchToHTML():switchToDesign()} sx={{display:"flex",alignItems:"center",gap:0.5,px:1.25,py:0.5,border:"none",borderRadius:1,cursor:"pointer",bgcolor:viewMode===m?colors.primary:"transparent",color:viewMode===m?"#fff":"#666",fontSize:"0.8rem",fontWeight:500,"&:hover":{bgcolor:viewMode===m?colors.primary:"#f0f0f0"}}}>
            {m==="html"&&<Code2 size={13}/>}{m==="design"?"Design":"HTML"}
          </Box>
        ))}

        <Divider orientation="vertical" flexItem sx={{borderColor:"#e0e0e0"}}/>

        <Tooltip title="Reset canvas"><IconButton size="small" onClick={reset} sx={{"&:hover":{color:"#dc2626"}}}><RotateCcw size={14}/></IconButton></Tooltip>
        <Tooltip title="Preview"><IconButton size="small" onClick={()=>setShowPreviewModal(true)} sx={{color:colors.primary}}><Eye size={15}/></IconButton></Tooltip>
        <Tooltip title={isFullscreen?"Exit fullscreen (Esc)":"Fullscreen"}><IconButton size="small" onClick={()=>setIsFullscreen(v=>!v)}>{isFullscreen?<Minimize2 size={15}/>:<Maximize2 size={15}/>}</IconButton></Tooltip>
      </Box>

      {/* Floating rich toolbar portal */}
      {textEditId&&viewMode==="design"&&(
        <FloatingRichToolbar toolbarRef={toolbarRef} blockRef={editingBlockRef}/>
      )}

      {/* ─ Body ─ */}
      <Box sx={{display:"flex",flex:1,minHeight:0,overflow:"hidden"}}>

        {/* Left palette */}
        {viewMode==="design"&&(
          <Box sx={{width:156,flexShrink:0,bgcolor:"#fff",borderRight:"1px solid #e8e8e8",overflowY:"auto",py:1.5}}>
            <Typography sx={{px:2,pb:0.75,fontSize:"0.65rem",fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.07em"}}>Blocks</Typography>
            {palette.map(({type,label,Icon},idx)=>(
              <Box key={`${type}${idx}`} draggable onDragStart={(e)=>onPalDragStart(e,type,label)}
                onClick={()=>{
                  const ov:Partial<ColumnsData>={};
                  if(type==="columns"&&label==="Cols"){
                    ov.colCount=2;
                    ov.cols=[[],[]];
                  }
                  addBlock(type,blocks.length,ov as Partial<BlockData>);
                }}
                sx={{display:"flex",alignItems:"center",gap:1.25,px:2,py:0.875,cursor:"grab",borderRadius:1,mx:1,mb:0.25,"&:hover":{bgcolor:`${colors.primary}0e`},"&:active":{cursor:"grabbing"},userSelect:"none"}}
              >
                <Icon size={14} color="#666" strokeWidth={1.75}/>
                <Typography sx={{fontSize:"0.8125rem",color:"#444",fontWeight:500}}>{label}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Center: canvas or HTML */}
        {viewMode==="design" ? (
          <Box sx={{flex:1,minWidth:0,bgcolor:bgColor,overflowY:"auto",py:3,px:2}} onDragEnd={onDragEnd}
            onClick={(e)=>{ if(e.target===e.currentTarget&&textEditId) setTextEditId(null); }}
          >
            <Box sx={{maxWidth:previewWidths[preview],mx:"auto",bgcolor:"#fff",boxShadow:"0 2px 16px rgba(0,0,0,0.1)",minHeight:240,transition:"max-width 0.25s"}}>
              {blocks.length===0?(
                <Box onDragOver={(e)=>{e.preventDefault();setDropIndex(0);}} onDrop={(e)=>onDropZoneDrop(e,0)}
                  sx={{height:280,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1.5,border:`2px dashed ${isDragging?colors.primary:"#ddd"}`,bgcolor:isDragging?`${colors.primary}06`:"transparent",transition:"all 0.15s",m:2,borderRadius:1}}
                >
                  <Layout size={32} color="#ccc" strokeWidth={1.25}/>
                  <Typography sx={{fontSize:"0.9rem",color:"#bbb"}}>Drag blocks here to build your email</Typography>
                  <Typography sx={{fontSize:"0.8rem",color:"#ccc"}}>or click a block in the left panel</Typography>
                </Box>
              ):(
                <>
                  <DropZone index={0} active={dropIndex===0&&isDragging} onDragOver={onDropZoneDragOver} onDrop={onDropZoneDrop}/>
                  {blocks.map((block,i)=>{
                    const isSel=block.id===selectedId&&!selectedSub;
                    const isEdit=textEditId===block.id;
                    return (
                      <Box key={block.id}>
                        <Box
                          ref={isEdit?(editingBlockRef as React.RefObject<HTMLDivElement>):undefined}
                          draggable={!isEdit}
                          onDragStart={(e)=>onBlockDragStart(e,block.id,i)}
                          onDoubleClick={()=>{ if(block.type==="text"||block.type==="heading"){setSelectedId(block.id);setSelectedSub(null);setTextEditId(block.id);} }}
                          onClick={(e)=>{ e.stopPropagation(); if(textEditId&&textEditId!==block.id)setTextEditId(null); setSelectedId(block.id===selectedId?null:block.id); setSelectedSub(null); }}
                          sx={{position:"relative",outline:isSel?`2px solid ${colors.primary}`:"2px solid transparent",outlineOffset:0,cursor:isEdit?"text":"pointer",opacity:dragSrcRef.current?.kind==="canvas"&&(dragSrcRef.current as any).id===block.id?0.3:1,transition:"opacity 0.15s","&:hover":{outline:isSel?`2px solid ${colors.primary}`:"2px solid #b3c6e0"}}}
                        >
                          {/* Type label */}
                          {isSel&&<Box sx={{position:"absolute",top:-1,left:-1,bgcolor:colors.primary,borderRadius:"0 0 5px 0",px:1,py:0.2,zIndex:5}}><Typography sx={{fontSize:"0.6rem",color:"#fff",fontWeight:700,textTransform:"uppercase"}}>{block.type}</Typography></Box>}

                          {/* Toolbar */}
                          {isSel&&(
                            <Box sx={{position:"absolute",top:-1,right:-1,display:"flex",bgcolor:colors.primary,borderRadius:"0 0 0 5px",zIndex:5}} onClick={(e)=>e.stopPropagation()}>
                              <Tooltip title="Drag"><IconButton size="small" sx={{color:"#fff",p:0.5,cursor:"grab"}}><GripVertical size={12}/></IconButton></Tooltip>
                              <Tooltip title="Move up"><span><IconButton size="small" disabled={i===0} onClick={()=>moveBlock(i,i-1)} sx={{color:i===0?"#ffffff55":"#fff",p:0.5}}><ChevronUp size={12}/></IconButton></span></Tooltip>
                              <Tooltip title="Move down"><span><IconButton size="small" disabled={i===blocks.length-1} onClick={()=>moveBlock(i,i+1)} sx={{color:i===blocks.length-1?"#ffffff55":"#fff",p:0.5}}><ChevronDown size={12}/></IconButton></span></Tooltip>
                              {(block.type==="text"||block.type==="heading")&&<Tooltip title="Edit text"><IconButton size="small" onClick={()=>setTextEditId(block.id)} sx={{color:"#fff",p:0.5}}><Type size={12}/></IconButton></Tooltip>}
                              <Tooltip title="Delete"><IconButton size="small" onClick={()=>removeBlock(block.id)} sx={{color:"#fff",p:0.5,"&:hover":{bgcolor:"#dc2626"}}}><Trash2 size={12}/></IconButton></Tooltip>
                            </Box>
                          )}

                          {/* Image resize */}
                          {isSel&&block.type==="image"&&<ImageResizeOverlay block={block} onWidthChange={(w)=>setBlocks(p=>p.map(b=>b.id===block.id?{...b,data:{...b.data,width:w}}:b))}/>}

                          <BlockRenderer block={block} isEditing={isEdit} toolbarRef={toolbarRef}
                            onSaveText={saveText} onEscapeEdit={()=>setTextEditId(null)}
                            onColDragOver={(e,ci,si)=>onColDragOver(e,block.id,ci,si)}
                            onColDrop={(e,ci,si)=>onColDrop(e,block.id,ci,si)}
                            onColBlockClick={(ci,si)=>{setSelectedSub({blockId:block.id,colIdx:ci,subIdx:si});setSelectedId(block.id);}}
                            onColBlockDelete={(ci,si)=>onColBlockDelete(block.id,ci,si)}
                            colDropTarget={colDrop?.blockId===block.id?colDrop:null}
                            selectedSubPath={selectedSub?.blockId===block.id?selectedSub:null}
                            isDragging={isDragging}
                          />
                        </Box>
                        <DropZone index={i+1} active={dropIndex===i+1&&isDragging} onDragOver={onDropZoneDragOver} onDrop={onDropZoneDrop}/>
                      </Box>
                    );
                  })}
                </>
              )}
            </Box>
          </Box>
        ) : (
          /* HTML view */
          <Box sx={{flex:1,minWidth:0,bgcolor:"#1e1e1e",overflow:"auto",p:2,display:"flex",flexDirection:"column",gap:1.5}}>
            <Box sx={{display:"flex",alignItems:"center",gap:1.5,flexWrap:"wrap"}}>
              <Typography sx={{fontSize:"0.78rem",color:"#aaa",mr:"auto"}}>
                {htmlEdited?"⚠️ HTML edited — switching to Design will apply as Raw HTML block":"Email HTML · editable"}
              </Typography>
              <Box component="button" onClick={()=>{navigator.clipboard.writeText(htmlDraft).catch(()=>{});setHtmlCopied(true);setTimeout(()=>setHtmlCopied(false),1600);}} sx={{display:"flex",alignItems:"center",gap:0.75,px:1.5,py:0.75,bgcolor:htmlCopied?"#166534":colors.primary,color:"#fff",border:"none",borderRadius:1,cursor:"pointer",fontSize:"0.78rem",fontWeight:600,"&:hover":{filter:"brightness(1.1)"},transition:"background-color 0.2s"}}>
                {htmlCopied?<Check size={13}/>:<Copy size={13}/>}{htmlCopied?"Copied!":"Copy HTML"}
              </Box>
              {htmlEdited&&<Box component="button" onClick={()=>{setHtmlDraft(generateEmailHTML(blocks,bgColor));setHtmlEdited(false);}} sx={{display:"flex",alignItems:"center",gap:0.5,px:1.25,py:0.75,bgcolor:"#374151",color:"#fff",border:"none",borderRadius:1,cursor:"pointer",fontSize:"0.78rem","&:hover":{bgcolor:"#4b5563"}}}>
                <RefreshCcw size={13}/> Reset to Design
              </Box>}
            </Box>
            <Box component="textarea" value={htmlDraft} onChange={(e)=>{setHtmlDraft(e.target.value);setHtmlEdited(true);}}
              sx={{flex:1,m:0,p:2,bgcolor:"#282c34",borderRadius:1,color:"#abb2bf",fontSize:"0.75rem",fontFamily:"'Fira Code','Cascadia Code','Consolas',monospace",lineHeight:1.6,border:"1px solid #3e4451",resize:"none",outline:"none","&:focus":{borderColor:"#528bff"}}}
              spellCheck={false}
            />
          </Box>
        )}

        {/* Right: Properties */}
        {viewMode==="design"&&(
          <Box sx={{width:248,flexShrink:0,bgcolor:"#fff",borderLeft:"1px solid #e8e8e8",overflowY:"auto"}}>
            {propertiesTarget?(
              <PropertiesPanel
                block={propertiesTarget.block}
                onChange={propertiesTarget.onChange}
                textEditId={propertiesTarget.textId}
                onStartEdit={()=>{ if(propertiesTarget.block.type==="text"||propertiesTarget.block.type==="heading") setTextEditId(selectedId); }}
              />
            ):(
              <Box sx={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,px:3,textAlign:"center"}}>
                <MousePointerClick size={28} color="#ddd" strokeWidth={1.25}/>
                <Typography sx={{fontSize:"0.875rem",color:"#bbb"}}>Click a block to edit properties</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Preview Modal */}
      <Modal open={showPreviewModal} onClose={()=>setShowPreviewModal(false)} sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Box sx={{bgcolor:"#fff",borderRadius:2,width:"90vw",height:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
          {/* Modal Header */}
          <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",p:2,borderBottom:"1px solid #e8e8e8",flexShrink:0}}>
            <Typography variant="h6" fontWeight={600}>Email Preview</Typography>
            <IconButton size="small" onClick={()=>setShowPreviewModal(false)}><X size={20}/></IconButton>
          </Box>

          {/* Modal Body - Preview */}
          <Box sx={{flex:1,overflow:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",bgcolor:bgColor,p:3,transition:"background-color 0.2s"}}>
            <Box sx={{width:previewWidths[preview],bgcolor:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.1)",borderRadius:1,overflow:"hidden",transition:"width 0.3s ease"}}>
              <Box sx={{"& table":{width:"100%"},"& img":{maxWidth:"100%",height:"auto",display:"block"}}} dangerouslySetInnerHTML={{__html:generateEmailHTML(blocks,bgColor)}}/>
            </Box>
          </Box>

          {/* Modal Footer - Device Tabs */}
          <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",gap:1,p:2,borderTop:"1px solid #e8e8e8",bgcolor:"#fafafa",flexShrink:0}}>
            {([["desktop",600],["tablet",480],["mobile",375]] as const).map(([size,width])=>(
              <Box
                key={size}
                component="button"
                onClick={()=>setPreview(size)}
                sx={{
                  display:"flex",
                  alignItems:"center",
                  gap:0.75,
                  px:2,
                  py:0.75,
                  border:`1.5px solid ${preview===size?colors.primary:"#e0e0e0"}`,
                  borderRadius:1,
                  cursor:"pointer",
                  bgcolor:preview===size?`${colors.primary}10`:"transparent",
                  color:preview===size?colors.primary:"#555",
                  fontWeight:preview===size?600:500,
                  fontSize:"0.875rem",
                  transition:"all 0.2s",
                  "&:hover":{borderColor:colors.primary,color:colors.primary}
                }}
              >
                <Typography sx={{textTransform:"capitalize",fontWeight:"inherit"}}>{size}</Typography>
                <Typography sx={{fontSize:"0.75rem",color:"inherit",opacity:0.7}}>{width}px</Typography>
              </Box>
            ))}
          </Box>

        </Box>
      </Modal>
    </Box>
  );
}
