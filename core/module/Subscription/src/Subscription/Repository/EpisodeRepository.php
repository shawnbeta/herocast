<?php
/**
 * This source file is part of HeroCast.
 *
 * HeroCast is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HeroCast is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with HeroCast. If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 *
 * PHP Version >=5.4
 *
 * @category HC_App
 * @package  module/Subscription
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */

namespace Subscription\Repository;

use Doctrine\ORM\EntityRepository;
use Zend\Paginator\Paginator;

use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

class EpisodeRepository extends EntityRepository
{
    
	public function getByPager($subscription, $page, $page_count, $om)
	{
		// Set the count
		$count = 10;
		
		// Build the statment by all or specific subscription
		$stmt = 	'SELECT e, s FROM Subscription\Entity\EpisodeEntity e';
		$stmt .= ' JOIN e.subscription s';
		
		// If subscription is set limit results based
		// on subscription (id).
		if($subscription) 
		    $stmt .= ' WHERE e.subscription = :subscription';
		
	    // Sort by episode pub date order newest to oldest.
		$stmt .= ' ORDER BY e.pub_date DESC';
		
		// Run the custom query to get results
		// from all subscriptions order by date.
		$query = $om->createQuery($stmt);
		
		// Set the subscription parameter for the 'filtered'
		// query. Again only valid if subscription is set.
		if($subscription)
			$query->setParameter('subscription', $subscription);
		
		// Create the paginator
		$paginator = new Paginator(
		  new DoctrinePaginator(new ORMPaginator($query))
		);		
	
		$paginator->setDefaultItemCountPerPage($page_count);		
		
		$paginator->setCurrentPageNumber($page);
		
		return $paginator;
	}
    
	
	public function getLatestEpisode($om)
	{
	    $query = $om->createQueryBuilder('e, s');
	    $query->select('e, s, MAX(e.pub_date) AS last_update, e.title, s.title');
	    $query->from('Subscription\Entity\EpisodeEntity', 'e');
	    $query->join('e.subscription', 's');
	    $query->groupBy('e.subscription');
	    $query->orderBy('e.pub_date', 'DESC');
	     
	    try {
	        $rsp = $query->getQuery();
	        // Return Scalar so the last_update
	        // field is available.
	        return $rsp->getScalarResult();
	         
	    } catch (\Doctrine\ORM\NoResultException $e) {
	        return null;
	    }
	}
	
}

?>