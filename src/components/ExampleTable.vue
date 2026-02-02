<script lang="ts" setup>
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
</script>
<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead> date </TableHead>
        <TableHead> amount </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <span>1/12/2025</span>
        </TableCell>
        <TableCell>
          <span>10500.00</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
