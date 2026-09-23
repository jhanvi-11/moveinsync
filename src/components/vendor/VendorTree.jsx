import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StatusChip } from '../common/StatusChip';
import { useTheme } from '@mui/material/styles';

const TreeNode = ({ vendor, level, allVendors, expandedIds, toggleExpand, onSelect, selectedId, focusedId, setFocusedId }) => {
  const theme = useTheme();
  const children = allVendors.filter(v => v.parentId === vendor.id);
  const isExpanded = expandedIds.has(vendor.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === vendor.id;
  const isFocused = focusedId === vendor.id;

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <Box
        tabIndex={isFocused ? 0 : -1}
        onClick={() => onSelect(vendor.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelect(vendor.id);
            e.preventDefault();
            e.stopPropagation();
          } else if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
            toggleExpand(vendor.id, true);
            e.preventDefault();
            e.stopPropagation();
          } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
            toggleExpand(vendor.id, false);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onFocus={() => setFocusedId(vendor.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 0.5,
          pl: level * 3,
          cursor: 'pointer',
          bgcolor: isSelected ? 'action.selected' : 'transparent',
          '&:hover': { bgcolor: 'action.hover' },
          outline: isFocused ? '2px solid' : 'none',
          outlineColor: 'primary.main',
          outlineOffset: -2
        }}
      >
        <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>
          {hasChildren && (
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleExpand(vendor.id); }} tabIndex={-1}>
              {isExpanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
        <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400 }}>{vendor.name}</Typography>
          <Typography variant="caption" sx={{ ml: 1, color: theme.palette.vendorAccents[vendor.level] }}>{vendor.level.toUpperCase()}</Typography>
          {vendor.status !== 'active' && <Box sx={{ ml: 1 }}><StatusChip status={vendor.status} /></Box>}
        </Box>
      </Box>
      {hasChildren && isExpanded && (
        <div role="group">
          {children.map(child => (
            <TreeNode
              key={child.id}
              vendor={child}
              level={level + 1}
              allVendors={allVendors}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelect={onSelect}
              selectedId={selectedId}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const VendorTree = ({ vendors, selectedId, onSelect }) => {
  const rootVendors = vendors.filter(v => !v.parentId);
  const [expandedIds, setExpandedIds] = useState(new Set(rootVendors.map(v => v.id)));
  const [focusedId, setFocusedId] = useState(rootVendors[0]?.id);

  const toggleExpand = (id, forceState) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (forceState !== undefined) {
        if (forceState) next.add(id);
        else next.delete(id);
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  };

  const computeVisible = () => {
    const v = [];
    const traverse = (nodes) => {
      nodes.forEach(node => {
        v.push(node.id);
        if (expandedIds.has(node.id)) {
          traverse(vendors.filter(child => child.parentId === node.id));
        }
      });
    };
    traverse(rootVendors);
    return v;
  };
  const vis = computeVisible();

  const handleKeyDown = (e) => {
    if (!focusedId) return;
    const currentIndex = vis.indexOf(focusedId);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < vis.length - 1) {
        setFocusedId(vis[currentIndex + 1]);
        // Focus will naturally be pulled by onFocus if user clicks, but for keyboard we need a ref or let the render cycle catch it.
        // Actually, we manage focus via tabIndex={isFocused ? 0 : -1}, but we should also call .focus() on the element.
        // For simplicity, we just set focusedId and rely on a generic hook or standard DOM focus.
        setTimeout(() => {
          const el = document.querySelector(`[tabindex="0"]`);
          if (el) el.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        setFocusedId(vis[currentIndex - 1]);
        setTimeout(() => {
          const el = document.querySelector(`[tabindex="0"]`);
          if (el) el.focus();
        }, 0);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (vis.length > 0) {
        setFocusedId(vis[0]);
        setTimeout(() => {
          const el = document.querySelector(`[tabindex="0"]`);
          if (el) el.focus();
        }, 0);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      if (vis.length > 0) {
        setFocusedId(vis[vis.length - 1]);
        setTimeout(() => {
          const el = document.querySelector(`[tabindex="0"]`);
          if (el) el.focus();
        }, 0);
      }
    }
  };

  return (
    <Box role="tree" onKeyDown={handleKeyDown} sx={{ outline: 'none' }} tabIndex={-1}>
      {rootVendors.map(vendor => (
        <TreeNode
          key={vendor.id}
          vendor={vendor}
          level={0}
          allVendors={vendors}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          onSelect={onSelect}
          selectedId={selectedId}
          focusedId={focusedId}
          setFocusedId={setFocusedId}
        />
      ))}
    </Box>
  );
};
