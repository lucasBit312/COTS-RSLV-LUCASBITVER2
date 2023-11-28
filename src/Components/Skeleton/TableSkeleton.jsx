import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

TableSkeleton.propTypes = {
    
};

function TableSkeleton(props) {
    const skeletonData = Array.from({ length: 10 });
    return (
        <div style={{marginTop:"100px", marginBottom:"50px"}}> 
            <Skeleton variant="text" width={100} style={{marginLeft:'18px'}}/>
            <Table sx={{ minWidth: 650 }} aria-label="skeleton table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" width={40} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={120} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={120} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skeletonData.map((_, index) => (
                <TableRow key={index}>
                  {[...Array(7)].map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    );
}
export default TableSkeleton;