package com.graphhopper.jsprit.util;

import java.text.DecimalFormat;
import java.util.Collection;

import com.graphhopper.jsprit.core.algorithm.listener.IterationEndsListener;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;

public class ProgressListener implements IterationEndsListener {

    public int maxIterations = 0;
    public ProgressListener(int maxIterations) {
        this.maxIterations = maxIterations;
	}

    private static DecimalFormat df = new DecimalFormat("0.00");
    
	@Override
    public void informIterationEnds(int i, VehicleRoutingProblem problem, Collection<VehicleRoutingProblemSolution> solutions) {
                
        double percent = (100 * i) / this.maxIterations ;
        
        if( i < this.maxIterations )  {
            
            System.out.println(percent/100);
        
        } else {

            System.out.println(1.00);
        }
    }



}